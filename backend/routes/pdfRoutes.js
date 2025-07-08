const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

router.post('/extract', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Convert buffer to Uint8Array
    const data = new Uint8Array(req.file.buffer);
    
    // Parse PDF with proper data format
    const pdfData = await pdf(data);
    
    if (!pdfData.text || pdfData.text.trim().length < 20) {
      return res.status(400).json({ 
        error: 'PDF contains too little text (minimum 20 characters required)'
      });
    }

    res.json({ 
      text: pdfData.text,
      pages: pdfData.numpages
    });

  } catch (err) {
    console.error('PDF extraction error:', err);
    res.status(500).json({ 
      error: 'Failed to extract text from PDF',
      details: err.message
    });
  }
});

module.exports = router;