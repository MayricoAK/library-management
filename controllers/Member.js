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

// Add new member
exports.addNewMember = async (req, res) => {
  try {
    const { code, name } = req.body;

    // Check if the member already exists
    const existingMember = await Member.findOne({ code });
    if (existingMember) {
      return res.status(400).json({ message: 'Member already exists' });
    }

    const newMember = new Member({ code, name });
    await newMember.save();

    res.status(201).json({ message: 'New member added', member: newMember });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an existing member
exports.deleteExistMember = async (req, res) => {
  try {
    const { code } = req.params;

    const member = await Member.findOneAndDelete({ code });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({ message: 'Member deleted', member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};