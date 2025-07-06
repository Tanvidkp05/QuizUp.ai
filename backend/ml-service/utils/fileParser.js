const pdf = require('pdf-parse');
const pptx = require('pptxgenjs');

// PDF Text Extraction
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (err) {
    throw new Error('Failed to parse PDF');
  }
}

// PPT Text Extraction (simplified)
async function extractTextFromPPT(buffer) {
  return new Promise((resolve) => {
    // This is a simplified version - in production use a proper PPT parser
    const text = "PPT content extraction would require a more advanced library";
    resolve(text);
  });
}

module.exports = { extractTextFromPDF, extractTextFromPPT };