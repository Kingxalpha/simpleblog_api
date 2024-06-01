const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    categories: { type: String, enum: ['community', 'ecosystem'] },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);