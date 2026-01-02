const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");

const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");

// ===============================
// POST: Generate onboarding doc
// ===============================
router.post("/generate", async (req, res) => {
  try {
    const { employeeName, role, elements } = req.body;

    // 1. Validate input
    if (
      !employeeName ||
      !role ||
      !Array.isArray(elements) ||
      elements.length === 0
    ) {
      return res.status(400).json({
        error: "Name, role, and onboarding elements are required",
      });
    }

    // 2. Fetch templates from MongoDB
    const templates = await Template.find({
      key: { $in: elements },
    });

    if (templates.length === 0) {
      return res.status(400).json({
        error: "No matching templates found",
      });
    }

    // 3. Build document text
    let documentText = `Welcome ${employeeName}!\n\n`;
    documentText += `We are pleased to welcome you as a ${role}.\n\n`;

    templates.forEach((t) => {
      documentText += `${t.title}:\n`;
      documentText += `${t.content}\n\n`;
    });

    documentText +=
      "We look forward to your contributions and wish you success in your role.";

    // 4. Save history in MongoDB
    const savedDoc = await GeneratedDocument.create({
      employeeName,
      role,
      elements,
      content: documentText,
      createdAt: new Date(),
    });

    // 5. Create PDF
    const pdf = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${employeeName}_onboarding.pdf`
    );

    pdf.pipe(res);
    pdf.fontSize(18).text("HR Onboarding Document", { align: "center" });
    pdf.moveDown();

    pdf.fontSize(12).text(documentText);
    pdf.end();
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ error: "Document generation failed" });
  }
});

// ===============================
// GET: Document history
// ===============================
router.get("/history", async (req, res) => {
  try {
    const docs = await GeneratedDocument.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to load history" });
  }
});

module.exports = router;
