const express = require("express");
const router = express.Router();
const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ Generate Preview + Save (AI-powered)
router.post("/generate", async (req, res) => {
  try {
    const { employeeName, role, selectedElements } = req.body;

    if (!employeeName || !role || !selectedElements?.length) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const templates = await Template.find({
      key: { $in: selectedElements }
    });

    const templateText = templates
      .map(t => `${t.title}: ${t.content}`)
      .join("\n\n");

    const prompt = `
You are an HR assistant.
Create a professional onboarding document.

Employee Name: ${employeeName}
Role: ${role}

Include the following sections:
${templateText}

Tone: professional, welcoming, clear.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const generatedContent = completion.choices[0].message.content;

    const saved = await GeneratedDocument.create({
      employeeName,
      role,
      content: generatedContent
    });

    res.json({
      content: generatedContent,
      documentId: saved._id
    });

  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ error: "Generation failed" });
  }
});

// ✅ Download PDF (uses existing content)
router.get("/download/:id", async (req, res) => {
  const PDFDocument = require("pdfkit");
  const docData = await GeneratedDocument.findById(req.params.id);

  if (!docData) return res.status(404).send("Not found");

  const pdf = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${docData.employeeName}.pdf`
  );

  pdf.pipe(res);
  pdf.fontSize(12).text(docData.content);
  pdf.end();
});

// ✅ History API (NEW – additive)
router.get("/history", async (req, res) => {
  const docs = await GeneratedDocument.find()
    .sort({ createdAt: -1 });
  res.json(docs);
});

module.exports = router;
