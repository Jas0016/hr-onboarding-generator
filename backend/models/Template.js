const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model("Template", TemplateSchema);
