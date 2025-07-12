// // // src/models/Item.js
// // const mongoose = require('mongoose');

// // const itemSchema = new mongoose.Schema({
// //   title: { type: String, required: true },
// //   description: String,
// //   category: String,
// //   type: String,
// //   size: String,
// //   condition: String,
// //   tags: [String],
// //   images: [String], // URLs
// //   uploader: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'User',
// //     required: true
// //   },
// //   createdAt: { type: Date, default: Date.now },
// //   availability: { type: Boolean, default: true }
// // });

// // module.exports = mongoose.model('Item', itemSchema);



// const mongoose = require('mongoose');

// const itemSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   category: String,
//   type: String,
//   size: String,
//   condition: String,
//   tags: [String],
//   images: [String],
//   uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   availability: {
//     type: String,
//     enum: ['available', 'swapped', 'redeemed'],
//     default: 'available',
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('Item', itemSchema);





const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  type: String,
  size: String,
  condition: String,
  tags: [String],
  images: [String],
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ✅ must match the User model name
    required: true
  },
  availability: {
    type: String,
    enum: ['available', 'redeemed', 'swapped'],
    default: 'available'
  },
  points: {
    type: Number,
    default: 10
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
