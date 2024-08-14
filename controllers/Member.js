const Member = require('../models/Members');

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().populate('borrowedBooks'); 

    // Menambahkan total jumlah buku yang dipinjam untuk setiap member
    const membersWithTotalBorrowedBooks = members.map(member => {
      const totalBorrowedBooks = member.borrowedBooks.length;
      return {
        ...member.toObject(), // Mengonversi dokumen Mongoose ke objek JavaScript biasa
        totalBorrowedBooks // Menambahkan properti totalBorrowedBooks ke setiap member
      };
    });

    res.status(200).json({ data: membersWithTotalBorrowedBooks }); // Mengembalikan data member beserta jumlah total buku yang dipinjam
  } catch (err) {
    res.status(500).json({ message: err.message }); // Mengembalikan status 500 jika terjadi kesalahan
  }
};


// Get member's detail
exports.getDetailMember = async (req, res) => {
  try {
    const { code } = req.params;
    const member = await Member.findOne({ code: code }).populate('borrowedBooks'); // Populate borrowedBooks with book details

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({
      message: 'Member details',
      code: member.code,
      name: member.name,
      borrowedBooks: member.borrowedBooks,
      totalBorrowedBooks: member.borrowedBooks.length,
      penaltyEndDate: member.penaltyEndDate
    });
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