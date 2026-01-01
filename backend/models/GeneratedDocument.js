const mongoose = require("mongoose");

const generatedDocumentSchema = new mongoose.Schema({
  employeeName: String,
  role: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "GeneratedDocument",
  generatedDocumentSchema
);
