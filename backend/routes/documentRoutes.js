const express = require("express");
const PDFDocument = require("pdfkit");
const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");

const router = express.Router();

/**
 * POST /api/documents/generate
 * Generates onboarding PDF and streams it to browser
 */
router.post("/generate", async (req, res) => {
  try {
    const { employeeName, role, elements } = req.body;

    if (!employeeName || !role || !elements || elements.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch selected templates from MongoDB
    const templates = await Template.find({ key: { $in: elements } });

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    // IMPORTANT HEADERS
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="onboarding-${employeeName}.pdf"`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // PDF CONTENT
    doc.fontSize(20).text("HR Onboarding Document", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Welcome ${employeeName}!`);
    doc.text(`Role: ${role}`);
    doc.moveDown();

    templates.forEach((tpl) => {
      doc.fontSize(16).text(tpl.title, { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(tpl.content);
      doc.moveDown();
    });

    doc.moveDown();
    doc.text(
      "We look forward to your contributions and wish you success in your role."
    );

    // FINALIZE PDF
    doc.end();

    // Save history (non-blocking)
    await GeneratedDocument.create({
      employeeName,
      role,
      content: templates.map(t => `${t.title}: ${t.content}`).join("\n\n"),
    });

  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate document" });
  }
});

module.exports = router;
