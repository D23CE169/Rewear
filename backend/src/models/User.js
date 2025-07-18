const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  points: { type: Number, default: 100 }

});

module.exports = mongoose.model('User', userSchema);
