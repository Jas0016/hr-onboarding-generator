const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");

const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");

/* ---------------- PREVIEW ---------------- */
router.post("/preview", async (req, res) => {
  try {
    const { employeeName, role, elements } = req.body;

    if (!employeeName || !role || !elements?.length) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const templates = await Template.find({ key: { $in: elements } });

    let content = `Welcome ${employeeName}!\n\n`;
    content += `We are pleased to welcome you as a ${role}.\n\n`;

    templates.forEach(t => {
      content += `${t.title}:\n${t.content}\n\n`;
    });

    content += "We look forward to your contributions and wish you success.";

    res.json({ content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Preview failed" });
  }
});

/* ---------------- DOWNLOAD PDF ---------------- */
router.post("/download", async (req, res) => {
  try {
    const { employeeName, role, elements, content } = req.body;

    if (!employeeName || !role || !elements?.length || !content) {
      return res.status(400).json({ error: "Invalid input" });
    }

    await GeneratedDocument.create({
      employeeName,
      role,
      selectedElements: elements,
      content
    });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${employeeName}_onboarding.pdf`
    );

    doc.pipe(res);

    doc.fontSize(18).text("HR Onboarding Document", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12).text(content);

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

/* ---------------- HISTORY ---------------- */
router.get("/history", async (req, res) => {
  const docs = await GeneratedDocument.find().sort({ createdAt: -1 });
  res.json(docs);
});

module.exports = router;
