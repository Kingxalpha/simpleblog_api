const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');

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

module.exports = router;
