const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  penaltyEndDate: { type: Date, default: null },
});

module.exports = mongoose.model('Member', MemberSchema);