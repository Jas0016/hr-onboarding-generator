const express = require("express");
const PDFDocument = require("pdfkit");
const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { employeeName, role, selectedElements } = req.body;

    if (!employeeName || !role || !selectedElements.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const templates = await Template.find({
      key: { $in: selectedElements }
    });

    let content = `Welcome ${employeeName}!\n\n`;
    content += `We are pleased to welcome you as a ${role}.\n\n`;

    templates.forEach(t => {
      content += `${t.title}: ${t.content}\n\n`;
    });

    content += "We look forward to your contributions and wish you success.";

    // Save history
    await GeneratedDocument.create({
      employeeName,
      role,
      content,
      createdAt: new Date()
    });

    // PDF creation
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${employeeName}_Onboarding.pdf"`
    );

    doc.pipe(res);
    doc.fontSize(12).text(content);
    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

router.get("/history", async (req, res) => {
  const docs = await GeneratedDocument.find().sort({ createdAt: -1 });
  res.json(docs);
});

module.exports = router;
