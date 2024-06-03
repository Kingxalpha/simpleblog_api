const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const upload = require('../middleware/upload');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

router.post('/', auth, async (req, res) => {
    const { fullName, mobile_no, email, location, profileInfo } = req.body;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            return res.status(400).json({ msg: 'Profile already exists' });
        }

        profile = new Profile({
            user: req.user.id,
            fullName,
            mobile_no,
            email,
            location,
            profileInfo
        });

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a profile
router.put('/', auth, async (req, res) => {
    const { fullName, mobile_no, email, location, profileInfo } = req.body;

    const profileFields = {
        fullName,
        mobile_no,
        email,
        location,
        profileInfo
    };

    try {
        let profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true }
        );

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// user profile
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);

        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// uplaod image
router.post('/upload/:id', auth, async (req, res) => {
    try {
        console.log('File:', req.files);
        console.log('Body:', req.body);
      if (!req.files || !req.files.profileImage) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
  
      const profileImage = req.files.profileImage;
  
      const allowedTypes = /jpeg|jpg|png/;
      const mimeType = allowedTypes.test(profileImage.mimetype);
      const extName = allowedTypes.test(path.extname(profileImage.name).toLowerCase());
  
      if (!mimeType || !extName) {
        return res.status(400).json({ msg: 'Only images are allowed' });
      }
  
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      const uploadPath = `uploads/${profileImage.name}`;
  
      profileImage.mv(uploadPath, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Server error');
        }
  
        user.profileImage = uploadPath;
        await user.save();
  
        res.json({ msg: 'Profile image uploaded', file: uploadPath });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

//   get user image
  router.get('/image/:id', auth, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      res.sendFile(path.resolve(user.profileImage));
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

//   update user image
  router.patch('/upload/:id', auth, async (req, res) => {
    try {
      if (!req.files || !req.files.profileImage) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
  
      const profileImage = req.files.profileImage;
  
      const allowedTypes = /jpeg|jpg|png/;
      const mimeType = allowedTypes.test(profileImage.mimetype);
      const extName = allowedTypes.test(path.extname(profileImage.name).toLowerCase());
  
      if (!mimeType || !extName) {
        return res.status(400).json({ msg: 'Only images are allowed' });
      }
  
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      const uploadPath = path.join(__dirname, '..', 'uploads', profileImage.name);
  
      if (user.profileImage) {
        fs.unlink(path.resolve(user.profileImage), (err) => {
          if (err) console.error('Error deleting existing profile image:', err.message);
        });
      }
  
      profileImage.mv(uploadPath, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Server error');
        }
  
        user.profileImage = uploadPath;
        await user.save();
  
        res.json({ msg: 'Profile image updated', file: uploadPath });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
