const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    userID: String,
    messages: Number,
    voiceTime: Number,
    joinTimeStamp: Number
});

module.exports = mongoose.model('User', guildSchema, 'users');