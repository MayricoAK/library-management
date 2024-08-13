const Book = require('../models/Books');
const Member = require('../models/Members');
const { 
  calculateDaysDifference, 
  penaltyDate,
  validateMember
} = require('../utils');

// Get all available books
exports.getAllAvailableBooks = async (req, res) => {
  try {
    const books = await Book.find({ borrowedBy: null });
  res.status(200).json({data: books});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.borrowBook = async (req, res) => {
  try {
    const { code, bookCode, borrowedDate } = req.body;

    // Konversi tanggal ke format yyyy-mm-dd
    const formattedBorrowedDate = new Date(borrowedDate.split('-').reverse().join('-'));

    const member = await Member.findOne({ code });
    // menghapus penalty jika borrowedDate > penaltyEndDate
    if (new Date(member.penaltyEndDate) > new Date()) {
      member.penaltyEndDate=null;
      await member.save();
    }

    const memberValidation = validateMember(member);
    if (!memberValidation.isValid) {
      return res.status(memberValidation.status).json({ message: memberValidation.message, endPenalty: memberValidation.endPenalty });
    }

    const book = await Book.findOne({ code: bookCode });
    if (!book || book.borrowedBy) {
      return res.status(400).json({ message: 'Book not available for borrowing' });
    }

    book.borrowedBy = member._id;
    book.borrowDate = formattedBorrowedDate;  // Simpan tanggal dengan format yang benar
    await book.save();

    member.borrowedBooks.push(book._id);
    await member.save();

    res.status(200).json({message: 'Book is borrowed', book});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { code, bookCode, returnedDate } = req.body;

    // Konversi tanggal ke format yyyy-mm-dd
    const formattedReturnedDate = new Date(returnedDate.split('-').reverse().join('-'));

    const member = await Member.findOne({ code });
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const book = await Book.findOne({ code: bookCode, borrowedBy: member._id });
    if (!book) {
      return res.status(400).json({ message: 'This member has not borrowed this book' });
    }

    const daysBorrowed = calculateDaysDifference(book.borrowDate, formattedReturnedDate);
    if (daysBorrowed >= 7) {
      // Menambahkan penalti 3 hari
      const overDate = penaltyDate(returnedDate); // Menggunakan format dd-mm-yyyy
      const formattedPenaltyDate = new Date(overDate);
      member.penaltyEndDate = formattedPenaltyDate;
    }
    if (book.borrowDate > formattedReturnedDate) {
      return res.status(400).json({ message: 'Returned Date is invalid, must be newer than Borrowed Date' });
    }

    book.borrowedBy = null;
    book.borrowDate = null;
    await book.save();

    member.borrowedBooks = member.borrowedBooks.filter(
      (bookId) => bookId.toString() !== book._id.toString()
    );
    await member.save();

    res.status(200).json({ message: 'Book is returned', book});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};