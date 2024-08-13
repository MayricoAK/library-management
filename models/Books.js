const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  stock: { type: Number, required: true },
  borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },
  borrowDate: { type: Date, default: null },
});

module.exports = mongoose.model('Book', BookSchema);