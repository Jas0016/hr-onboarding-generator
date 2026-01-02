const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");

const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");

/**
 * POST /api/documents/generate
 * Generates preview content and optionally a PDF
 */
router.post("/generate", async (req, res) => {
  try {
    const { employeeName, role, elements, download } = req.body;

    // ---- VALIDATION ----
    if (
      !employeeName ||
      !role ||
      !Array.isArray(elements) ||
      elements.length === 0
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // ---- FETCH TEMPLATES ----
    const templates = await Template.find({
      key: { $in: elements },
    });

    // ---- BUILD PREVIEW CONTENT ----
    let preview = `Welcome ${employeeName}!\n\n`;
    preview += `We are pleased to welcome you as a ${role}.\n\n`;

    templates.forEach((t) => {
      preview += `${t.title}:\n`;
      preview += `${t.content}\n\n`;
    });

    preview += `We look forward to your contributions and wish you success.`;

    // ---- SAVE HISTORY ----
    await GeneratedDocument.create({
      employeeName,
      role,
      elements,
      content: preview,
      createdAt: new Date(),
    });

    // ---- PREVIEW ONLY ----
    if (!download) {
      return res.json({ preview });
    }

    // ---- PDF GENERATION ----
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=onboarding.pdf"
    );

    doc.pipe(res);

    // Title
    doc.fontSize(18).text("HR Onboarding Document", { align: "center" });
    doc.moveDown(2);

    // Welcome
    doc.fontSize(12).text(`Welcome ${employeeName}!`);
    doc.moveDown(0.5);
    doc.text(`We are pleased to welcome you as a ${role}.`);
    doc.moveDown(1.5);

    // Sections
    templates.forEach((t) => {
      doc.fontSize(13).text(t.title, { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).text(t.content);
      doc.moveDown(1.2);
    });

    // Footer
    doc.fontSize(11).text(
      "We look forward to your contributions and wish you success."
    );

    doc.end();
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ error: "Generation failed" });
  }
});

/**
 * GET /api/documents/history
 * Fetch generation history
 */
router.get("/history", async (req, res) => {
  try {
    const docs = await GeneratedDocument.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
