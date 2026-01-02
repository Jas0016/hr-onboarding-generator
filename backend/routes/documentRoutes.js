const express = require("express");
const router = express.Router();
const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");
const PDFDocument = require("pdfkit");

router.post("/generate", async (req, res) => {
  try {
    const { employeeName, role, elements } = req.body;

    // ✅ strict validation
    if (
      !employeeName ||
      !role ||
      !Array.isArray(elements) ||
      elements.length === 0
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // fetch templates
    const templates = await Template.find({ name: { $in: elements } });

    let content = `Welcome ${employeeName}!\n\n`;
    content += `We are pleased to welcome you as a ${role}.\n\n`;

    templates.forEach(t => {
      content += `${t.name}:\n${t.content}\n\n`;
    });

    content += "We look forward to your contributions and wish you success.";

    // save history
    await GeneratedDocument.create({
      employeeName,
      role,
      elements,
      content
    });

    // create PDF
    const pdf = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=onboarding.pdf"
    );

    pdf.pipe(res);
    pdf.fontSize(16).text("HR Onboarding Document\n\n");
    pdf.fontSize(12).text(content);
    pdf.end();
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
