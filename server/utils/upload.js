// utils/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');  // Assuming this imports your cloudinary config

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'BookAds', // Your folder name in Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'], // Allowed image formats
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit to 5 MB per file
  },
});

module.exports = upload;



