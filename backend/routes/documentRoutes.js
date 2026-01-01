const { generatePDF } = require("../services/pdfService");
const express = require("express");
const router = express.Router();

const GeneratedDocument = require("../models/GeneratedDocument");
const { generateOnboardingDocument } = require("../services/openaiService");

router.post("/generate", async (req, res) => {
  try {
    const { employeeName, role, sections } = req.body;

    const aiContent = await generateOnboardingDocument(
      employeeName,
      role,
      sections
    );

    const savedDoc = await GeneratedDocument.create({
      employeeName,
      role,
      content: aiContent,
    });

    res.json(savedDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/history", async (req, res) => {
  const docs = await GeneratedDocument.find().sort({ createdAt: -1 });
  res.json(docs);
});

module.exports = router;

router.get("/download/:id", async (req, res) => {
  try {
    const doc = await GeneratedDocument.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    generatePDF(doc.content, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
