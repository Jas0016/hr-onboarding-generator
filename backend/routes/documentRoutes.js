const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");

const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");

/**
 * PREVIEW GENERATION
 */
router.post("/generate", async (req, res) => {
  try {
    const { name, role, elements } = req.body;

    if (!name || !role || !elements || elements.length === 0) {
      return res.status(400).json({
        error: "Name, role, and onboarding elements are required",
      });
    }

    const templates = await Template.find({
      key: { $in: elements },
    });

    let content = `Welcome ${name}!\n\n`;
    content += `We are pleased to welcome you as a ${role}.\n\n`;

    templates.forEach((t) => {
      content += `${t.title}: ${t.content}\n\n`;
    });

    content += "We look forward to your contributions.";

    await GeneratedDocument.create({
      employeeName: name,
      role,
      elements,
      content,
      createdAt: new Date(),
    });

    res.json({ content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * PDF DOWNLOAD
 */
router.post("/download", (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content required" });
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="onboarding.pdf"'
    );

    doc.pipe(res);
    doc.fontSize(12).text(content);
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

module.exports = router;
