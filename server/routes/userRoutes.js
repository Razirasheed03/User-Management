const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { verifyToken } = require('../middlewares/verifyToken'); 
const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});


const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.png', '.jpg', '.jpeg', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed (.png, .jpg, .jpeg, .webp)'), false);
    }
};

const upload = multer({ storage, fileFilter });


router.post('/upload-profile', verifyToken, upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.user.id;
        const imageUrl = req.file.filename;

        const user = await User.findByIdAndUpdate(
            userId,
            { profileImage: imageUrl },
            { new: true }
        );

        res.status(200).json({ user, message: 'Profile image updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Image upload failed', error: err.message });
    }
});
// Get all users (admin only)
router.get('/all-users', verifyToken, async (req, res) => {
    try {
      // Check if user is admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }
  
      const users = await User.find().select('-password'); // exclude password
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
  });
  
module.exports = router;
