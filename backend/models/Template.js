const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema({
  name: String,
  content: String,
});

module.exports = mongoose.model("Template", TemplateSchema);
