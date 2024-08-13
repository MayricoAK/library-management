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
    const { memberId } = req.params;
    const member = await Member.findById(memberId).populate('borrowedBooks');
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({ message: 'Borrowed books count', count: member.borrowedBooks.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};