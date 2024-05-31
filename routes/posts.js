const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// Create a Post
router.post('/', auth, async (req, res) => {
    const { title, content } = req.body;
    try {
        const newPost = new Post({
            user: req.user.id,
            title,
            content
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
