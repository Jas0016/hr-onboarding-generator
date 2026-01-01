const express = require("express");
const router = express.Router();
const Template = require("../models/Template");
const Document = require("../models/Document");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔹 Generate onboarding document (AI enforced)
router.post("/generate", async (req, res) => {
  try {
    const { employeeName, role, selectedElements } = req.body;

    if (!employeeName || !role || !selectedElements?.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch templates from MongoDB
    const templates = await Template.find({
      key: { $in: selectedElements },
    });

    if (!templates.length) {
      return res.status(400).json({ error: "No templates found" });
    }

    const combinedTemplateText = templates
      .map((t) => `### ${t.title}\n${t.content}`)
      .join("\n\n");

    // 🔥 ENFORCED AI CALL (NO SILENT FALLBACK)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an HR assistant generating professional onboarding documents.",
        },
        {
          role: "user",
          content: `
Employee Name: ${employeeName}
Role: ${role}

Using the following onboarding sections, generate a professional onboarding document:

${combinedTemplateText}
          `,
        },
      ],
    });

    const finalContent = completion.choices[0].message.content;

    if (!finalContent) {
      return res.status(500).json({ error: "AI generation failed" });
    }

    // Save document history
    const savedDoc = await Document.create({
      employeeName,
      role,
      selectedElements,
      content: finalContent,
    });

    res.json({
      content: finalContent,
      documentId: savedDoc._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during generation" });
  }
});

// 🔹 Fetch document history by employee
router.get("/history/:employeeName", async (req, res) => {
  try {
    const docs = await Document.find({
      employeeName: req.params.employeeName,
    }).sort({ createdAt: -1 });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
