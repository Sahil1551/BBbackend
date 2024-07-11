const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Route to upload an image
router.post('/upload', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({ msg: 'No file was uploaded' });
    }

    const file = req.files.file;
    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: 'Size too large' });
    }

    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: 'File format is incorrect' });
    }

    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, { folder: 'test' });
      removeTmp(file.tempFilePath);
      return res.json({ public_id: result.public_id, url: result.secure_url });
    } catch (uploadErr) {
      removeTmp(file.tempFilePath);
      throw new Error(uploadErr.message);
    }
  } catch (err) {
    console.error('Upload Error:', err);
    return res.status(500).json({ msg: err.message });
  }
});

// Helper function to remove temporary files
const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error('File Removal Error:', err);
    }
  });
};

module.exports = router;
