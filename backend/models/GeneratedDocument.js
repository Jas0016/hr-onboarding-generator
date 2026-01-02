const mongoose = require("mongoose");

const GeneratedDocumentSchema = new mongoose.Schema({
  employeeName: String,
  role: String,
  elements: [String],
  content: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GeneratedDocument", GeneratedDocumentSchema);
