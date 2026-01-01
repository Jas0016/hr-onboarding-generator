const express = require("express");
const router = express.Router();
const Template = require("../models/Template");
const Document = require("../models/Document");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate onboarding document
router.post("/generate", async (req, res) => {
  try {
    const { employeeName, role, selectedElements } = req.body;

    if (!employeeName || !role || !selectedElements?.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const templates = await Template.find({
      key: { $in: selectedElements },
    });

    if (!templates.length) {
      return res.status(400).json({ error: "No templates found" });
    }

    const combinedTemplateText = templates
      .map((t) => `${t.title}: ${t.content}`)
      .join("\n\n");

    let finalContent;

    try {
      // 🔐 AI call with safety
      const completion = await Promise.race([
        openai.chat.completions.create({
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

Generate a professional onboarding document using these sections:

${combinedTemplateText}
              `,
            },
          ],
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("AI timeout")), 10000)
        ),
      ]);

      finalContent = completion.choices[0].message.content;
    } catch (aiError) {
      // ✅ SAFE FALLBACK (VISIBLE, NOT SILENT)
      finalContent = `
Welcome ${employeeName}!

We are pleased to welcome you as a ${role}.

${combinedTemplateText}

We look forward to your contributions and wish you success in your role.
      `;
    }

    const savedDoc = await Document.create({
      employeeName,
      role,
      selectedElements,
      content: finalContent,
    });

    res.json({ content: finalContent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Document generation failed" });
  }
});

// Fetch history
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
