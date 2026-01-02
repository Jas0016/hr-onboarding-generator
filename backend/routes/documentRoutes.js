const PDFDocument = require("pdfkit");

const generatePDF = (res, title, sections) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=onboarding.pdf");

  doc.pipe(res);

  doc
    .fontSize(20)
    .text(title, { align: "center" })
    .moveDown(2);

  sections.forEach((section) => {
    doc
      .fontSize(14)
      .text(section.heading, { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(11)
      .text(section.content, { align: "left" })
      .moveDown(1.5);
  });

  doc.end();
};
