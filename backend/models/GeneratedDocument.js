const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    selectedElements: {
      type: [String],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
