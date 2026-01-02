const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema({
  key: String,
  title: String,
  content: String,
});

module.exports = mongoose.model("Template", TemplateSchema);
