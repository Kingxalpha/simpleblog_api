const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String, required: true },
    mobile_no: { type: Number, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    profileInfo: { type: String, required: true },

});

module.exports = mongoose.model('Profile', ProfileSchema);