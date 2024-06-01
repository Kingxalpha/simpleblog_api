const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const path = require('path');
const fs = require('fs');

// Create a Post
router.post('/', auth, async (req, res) => {
    const { title, content, categories } = req.body;

    try {
        let coverImage = null;

        if (req.files && req.files.coverImage) {
            const file = req.files.coverImage;
            const uploadPath = path.join(__dirname, '..', 'uploads', file.name);

            fs.mkdirSync(path.dirname(uploadPath), { recursive: true });

            file.mv(uploadPath, err => {
                if (err) {
                    return res.status(500).send(err);
                }
            });

            coverImage = `/uploads/${file.name}`;
        }

        const newPost = new Post({
            user: req.user.id,
            title,
            content,
            categories,
            coverImage
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get All Posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', ['name', 'email']);
        res.json(posts);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Edit a Post
router.put('/:id', auth, async (req, res) => {
    const { title, content } = req.body;
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        if (post.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        post.title = title || post.title;
        post.content = content || post.content;

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete a Post
router.delete('/:id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        if (post.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        await post.remove();
        res.json({ msg: 'Post removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
