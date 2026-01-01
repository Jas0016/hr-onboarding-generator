const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");

const GeneratedDocument = require("../models/GeneratedDocument");
const { generateOnboardingDocument } = require("../services/openaiService");

// Generate document
router.post("/generate", async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Document generation failed" });
  }
});

// Get history by employee
router.get("/history/:employee", async (req, res) => {
  const docs = await GeneratedDocument.find({
    employeeName: req.params.employee,
  }).sort({ createdAt: -1 });

  res.json(docs);
});

// Download PDF
router.get("/download/:id", async (req, res) => {
  const docData = await GeneratedDocument.findById(req.params.id);
  if (!docData) return res.status(404).json({ error: "Not found" });

  const pdf = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="onboarding.pdf"'
  );

  pdf.pipe(res);
  pdf.fontSize(12).text(docData.content);
  pdf.end();
});

module.exports = router;
