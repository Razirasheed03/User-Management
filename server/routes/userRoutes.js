const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken'); // You already have this!

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});

const upload = multer({ storage });

// Upload profile image
router.post('/upload-profile', verifyToken, upload.single('profileImage'), async (req, res) => {
    try {
        const userId = req.user.id;
        const imageUrl = req.file.filename;

        const user = await User.findByIdAndUpdate(userId, { profileImage: imageUrl }, { new: true });

        res.status(200).json({ user, message: 'Profile image updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Image upload failed', error: err.message });
    }
});

module.exports = router;
