const express = require("express");
const router = express.Router();

const GeneratedDocument = require("../models/GeneratedDocument");
const { generateOnboardingDocument } = require("../services/openaiService");

// Generate onboarding document
router.post("/generate", async (req, res) => {
  try {
    console.log("Generate route hit");

    const { employeeName, role, sections } = req.body;

    const content = await generateOnboardingDocument(
      employeeName,
      role,
      sections
    );

    const savedDoc = await GeneratedDocument.create({
      employeeName,
      role,
      content,
    });

    res.json(savedDoc);
  } catch (error) {
    console.error("Generate error:", error);
    res.status(500).json({ error: "Document generation failed" });
  }
});

// History
router.get("/history", async (req, res) => {
  const docs = await GeneratedDocument.find().sort({ createdAt: -1 });
  res.json(docs);
});

// PDF download
router.get("/download/:id", async (req, res) => {
  try {
    const doc = await GeneratedDocument.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });

    const PDFDocument = require("pdfkit");
    const pdf = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="onboarding.pdf"'
    );

    pdf.pipe(res);
    pdf.fontSize(12).text(doc.content);
    pdf.end();
  } catch (err) {
    res.status(500).json({ error: "PDF generation failed" });
  }
});

module.exports = router;
