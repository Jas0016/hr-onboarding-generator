const express = require("express");
const router = express.Router();

const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");
const PDFDocument = require("pdfkit");

/**
 * POST /api/documents/generate
 * Handles preview OR PDF generation
 */
router.post("/generate", async (req, res) => {
  try {
    const { employeeName, role, elements, previewOnly } = req.body;

    if (!employeeName || !role || !elements || elements.length === 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const templates = await Template.find({
      key: { $in: elements },
    });

    let content = `Welcome ${employeeName}!\n\n`;
    content += `We are pleased to welcome you as a ${role}.\n\n`;

    templates.forEach((t) => {
      content += `${t.name}:\n${t.content}\n\n`;
    });

    content += "We look forward to your contributions and wish you success.";

    // SAVE HISTORY
    await GeneratedDocument.create({
      employeeName,
      role,
      content,
    });

    // PREVIEW ONLY
    if (previewOnly) {
      return res.json({ content });
    }

    // PDF GENERATION
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${employeeName}_Onboarding.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text("HR Onboarding Document", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12).text(`Employee: ${employeeName}`);
    doc.text(`Role: ${role}`);
    doc.moveDown(2);

    templates.forEach((t) => {
      doc.fontSize(14).text(t.name, { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).text(t.content);
      doc.moveDown(1.5);
    });

    doc.end();
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/documents/history
 */
router.get("/history", async (req, res) => {
  const history = await GeneratedDocument.find()
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(history);
});

module.exports = router;
