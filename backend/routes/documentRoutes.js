const express = require("express");
const router = express.Router();
const Template = require("../models/Template");
const GeneratedDocument = require("../models/GeneratedDocument");

router.post("/generate", async (req, res) => {
  try {
    const { name, role, elements } = req.body;

    if (!name || !role || !elements || elements.length === 0) {
      return res.status(400).json({
        error: "Name, role, and onboarding elements are required"
      });
    }

    // Fetch templates from DB
    const templates = await Template.find({
      key: { $in: elements }
    });

    if (!templates.length) {
      return res.status(400).json({ error: "No templates found" });
    }

    // Build document text
    let content = `Welcome ${name}!\n\n`;
    content += `We are pleased to welcome you as a ${role}.\n\n`;

    templates.forEach((t) => {
      content += `${t.title}: ${t.content}\n\n`;
    });

    content += "We look forward to your contributions.";

    // Save history
    await GeneratedDocument.create({
      name,
      role,
      elements,
      content
    });

    return res.json({ content });

  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
