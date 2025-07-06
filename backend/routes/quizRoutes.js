const express = require('express');
const axios = require('axios');
const router = express.Router();

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

module.exports = router;