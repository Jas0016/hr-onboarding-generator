const PDFDocument = require("pdfkit");

/**
 * Generates a PDF from text content
 */
function generatePDF(content, res) {
  const doc = new PDFDocument();

  // Set response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="onboarding-document.pdf"'
  );

  // Pipe PDF to response
  doc.pipe(res);

  // Add content
  doc.fontSize(12).text(content, {
    align: "left",
  });

  // Finalize PDF
  doc.end();
}

module.exports = { generatePDF };
