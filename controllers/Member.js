const Member = require('../models/Members');

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().populate('borrowedBooks');
    res.status(200).json({data: members});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get member's borrowed books count
exports.getBorrowedBooksCount = async (req, res) => {
  try {
    const { code } = req.params;
    const member = await Member.findOne({ code: code }).populate('borrowedBooks'); // Ensure the filter is an object
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({ message: 'Borrowed books by member', Total: member.borrowedBooks.length, books: member.borrowedBooks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};