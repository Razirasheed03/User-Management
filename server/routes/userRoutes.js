const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { verifyToken ,verifyAdmin} = require('../middlewares/verifyToken'); 
const router = express.Router();
// const { authenticateUser } = require('../middlewares/authMiddleware');


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

router.get('/all-users', verifyToken, async (req, res) => {
    try {

      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }
  
      const users = await User.find().select('-password'); 
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
  });

  
  router.delete('/delete-user/:id', verifyToken, async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Only admins can delete users' });
      }
  
      const userId = req.params.id;
  
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (err) {
      res.status(500).json({ message: 'Deletion failed', error: err.message });
    }
  });
  
  router.put('/edit-user/:id', verifyToken, async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Only admins can edit users' });
      }
  
      const { name, email, isAdmin } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, isAdmin },
        { new: true }
      ).select('-password');
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ user: updatedUser, message: 'User updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Update failed', error: err.message });
    }
  });


router.post('/add-user', verifyAdmin, async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password, isAdmin });
    await newUser.save();

    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add user', error: err.message });
  }
});

router.put('/update-name', verifyToken, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
  );

  res.json({ user: updatedUser });
});

  
  
module.exports = router;
