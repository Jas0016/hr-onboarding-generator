const express = require("express");
const PDFDocument = require("pdfkit");
const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");

const router = express.Router();

/**
 * POST /api/documents/preview
 * Returns preview text + saves history
 */
router.post("/preview", async (req, res) => {
  try {
    const { employeeName, role, elements } = req.body;

    if (!employeeName || !role || !Array.isArray(elements) || !elements.length) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const templates = await Template.find({ key: { $in: elements } });
    if (!templates.length) {
      return res.status(400).json({ error: "No templates found" });
    }

    let content = `Welcome ${employeeName}!\n\n`;
    content += `We are pleased to welcome you as a ${role}.\n\n`;

    templates.forEach(t => {
      content += `${t.title}:\n${t.content}\n\n`;
    });

    content += "We look forward to your contributions and wish you success.";

    const saved = await GeneratedDocument.create({
      employeeName,
      role,
      elements,
      content,
    });

    res.json({ documentId: saved._id, content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Preview generation failed" });
  }
});

/**
 * GET /api/documents/:id/pdf
 * Streams PDF for download
 */
router.get("/:id/pdf", async (req, res) => {
  try {
    const docData = await GeneratedDocument.findById(req.params.id);
    if (!docData) return res.status(404).send("Not found");

    const pdf = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="onboarding-${docData.employeeName}.pdf"`
    );

    pdf.pipe(res);
    pdf.fontSize(18).text("HR Onboarding Document", { align: "center" });
    pdf.moveDown();
    pdf.fontSize(12).text(docData.content);
    pdf.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("PDF generation failed");
  }
});

/**
 * GET /api/documents/history
 */
router.get("/history", async (req, res) => {
  const history = await GeneratedDocument.find().sort({ createdAt: -1 });
  res.json(history);
});

module.exports = router;
