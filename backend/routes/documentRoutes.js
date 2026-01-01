const express = require("express");
const PDFDocument = require("pdfkit");
const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");

const router = express.Router();

/**
 * Generate document + PDF
 */
router.post("/generate", async (req, res) => {
  try {
    const { employeeName, role, elements } = req.body;

    if (!employeeName || !role || !elements?.length) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Fetch selected templates
    const templates = await Template.find({
      key: { $in: elements },
    });

    let content = `Welcome ${employeeName}!\n\n`;
    content += `We are pleased to welcome you as a ${role}.\n\n`;

    templates.forEach((t) => {
      content += `${t.title}: ${t.content}\n\n`;
    });

    content +=
      "We look forward to your contributions and wish you success in your role.";

    // Save history
    await GeneratedDocument.create({
      employeeName,
      role,
      content,
      createdAt: new Date(),
    });

    // ---- PDF GENERATION ----
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${employeeName}_Onboarding.pdf"`
    );

    doc.pipe(res);

    doc.fontSize(14).text("HR Onboarding Document\n\n", {
      align: "center",
    });

    doc.moveDown();
    doc.fontSize(11).text(content);

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "PDF generation failed" });
  }
});

/**
 * Fetch history
 */
router.get("/history", async (req, res) => {
  const docs = await GeneratedDocument.find().sort({ createdAt: -1 });
  res.json(docs);
});

module.exports = router;
