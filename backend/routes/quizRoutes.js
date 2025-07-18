const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');

const upload = multer({ storage: multer.memoryStorage() });


router.post('/generate', async (req, res) => {
  try {
    const { text } = req.body;
    
    // Validate input
    if (!text || text.trim().length < 20) {
      return res.status(400).json({ 
        error: "Please provide at least 20 characters of text" 
      });
    }

    const response = await axios.post('http://localhost:5001/generate_quiz', 
      { content: text.substring(0, 2000) },  // Limit input size
      { timeout: 30000 }
    );

    if (!response.data?.questions?.length) {
      throw new Error("Received empty questions array");
    }

    res.json(response.data);
    
  } catch (err) {
    console.error(`Error at ${new Date().toISOString()}:`, err.message);
    res.status(500).json({ 
      error: "Failed to process your request",
      details: err.response?.data || err.message 
    });
  }
});

router.post('/extract', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfText = await pdfParse(req.file.buffer);
    const content = pdfText.text;

    if (!content || content.length < 20) {
      return res.status(400).json({ error: 'PDF content is too short for quiz generation' });
    }

    const response = await axios.post('http://localhost:5001/generate_quiz', {
      content: content.substring(0, 2000)
    });

    res.json(response.data);
  } catch (err) {
    console.error("PDF extract error:", err.message);
    res.status(500).json({ error: "Failed to extract and generate quiz from PDF" });
  }
});

module.exports = router;