const express = require("express");
const router = express.Router();

const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");

/**
 * POST /api/documents/generate
 * PURPOSE:
 * - Generate onboarding document text
 * - RETURN JSON for PREVIEW
 * - SAVE history in MongoDB
 * - NO PDF here
 */
router.post("/generate", async (req, res) => {
  try {
    const { name, role, elements } = req.body;

    // Validation
    if (!name || !role || !elements || elements.length === 0) {
      return res.status(400).json({
        error: "Name, role, and onboarding elements are required"
      });
    }

    // Fetch selected templates
    const templates = await Template.find({
      key: { $in: elements }
    });

    if (templates.length === 0) {
      return res.status(400).json({
        error: "No templates found for selected elements"
      });
    }

    // Build document content
    let content = `Welcome ${name}!\n\n`;
    content += `We are pleased to welcome you as a ${role}.\n\n`;

    templates.forEach(template => {
      content += `${template.title}: ${template.content}\n\n`;
    });

    content += "We look forward to your contributions and wish you success in your role.";

    // Save document history
    await GeneratedDocument.create({
      name,
      role,
      content,
      createdAt: new Date()
    });

    // RETURN JSON FOR PREVIEW
    return res.status(200).json({
      content
    });

  } catch (error) {
    console.error("Generate error:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
});

/**
 * GET /api/documents/history
 * PURPOSE:
 * - Fetch document generation history
 */
router.get("/history", async (req, res) => {
  try {
    const history = await GeneratedDocument.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to load history" });
  }
});

module.exports = router;
