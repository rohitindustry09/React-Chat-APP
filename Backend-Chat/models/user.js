const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  avatar: { type: String }, // Corrected "avtar" to "avatar" (optional if intentional)
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, default: '+91 xxxxx-xxxxx' },
  bio: { type: String, default: 'Hey! I am on Mood.' },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }] 
});

// Set default avatar
userSchema.pre('save', function (next) {
  if (!this.avatar && this.email) {
    this.avatar = `https://robohash.org/${encodeURIComponent(this.email)}?set=set1&size=150x150`;
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
