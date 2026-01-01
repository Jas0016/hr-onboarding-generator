const mongoose = require("mongoose");

const GeneratedDocumentSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "GeneratedDocument",
  GeneratedDocumentSchema
);
