const pdfParse = require('pdf-parse');

async function extractTextFromPDF(buffer) {
  const data = await pdfParse(buffer);
  return { text: data.text, pageCount: data.numpages };
}

module.exports = { extractTextFromPDF };
