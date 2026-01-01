const express = require("express");
const router = express.Router();
const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");
const PDFDocument = require("pdfkit");

// Generate document
router.post("/generate", async (req, res) => {
  try {
    const { employeeName, role, elements } = req.body;

    const templates = await Template.find({
      key: { $in: elements }
    });

    let content = `Welcome ${employeeName}!\n\n`;
    content += `We are pleased to welcome you as a ${role}.\n\n`;

    templates.forEach(t => {
      content += `${t.title}: ${t.content}\n\n`;
    });

    content +=
      "We look forward to your contributions and wish you success in your role.";

    const saved = await GeneratedDocument.create({
      employeeName,
      role,
      content
    });

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Document generation failed" });
  }
});

// Download PDF
router.get("/download/:id", async (req, res) => {
  const docData = await GeneratedDocument.findById(req.params.id);
  if (!docData) return res.sendStatus(404);

  const pdf = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=onboarding-${docData.employeeName}.pdf`
  );

  pdf.pipe(res);
  pdf.text(docData.content);
  pdf.end();
});

// History
router.get("/history", async (req, res) => {
  const docs = await GeneratedDocument.find().sort({ createdAt: -1 });
  res.json(docs);
});

module.exports = router;
