const express = require("express");
const router = express.Router();

const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");

/**
 * POST /api/documents/generate
 * Generates onboarding document preview + saves history
 */
router.post("/generate", async (req, res) => {
  try {
    const { name, role, elements } = req.body;

    // 🔒 Validation
    if (!name || !role || !elements || elements.length === 0) {
      return res.status(400).json({
        error: "Name, role, and onboarding elements are required",
      });
    }

    // Fetch templates
    const templates = await Template.find({
      key: { $in: elements },
    });

    // Build content
    let content = `Welcome ${name}!\n\n`;
    content += `We are pleased to welcome you as a ${role}.\n\n`;

    templates.forEach((t) => {
      content += `${t.title}: ${t.content}\n\n`;
    });

    content += "We look forward to your contributions.";

    // ✅ SAVE WITH CORRECT FIELD NAME
    await GeneratedDocument.create({
      employeeName: name, // IMPORTANT
      role,
      elements,
      content,
      createdAt: new Date(),
    });

    // ✅ RETURN PREVIEW ONLY
    res.json({ content });
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
