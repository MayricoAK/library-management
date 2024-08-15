const Book = require('../models/Books');
const Member = require('../models/Members');
const utils = require('../utils');

// Get all existing books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({data: books});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all available books
exports.getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.find({ borrowedBy: null });
    res.status(200).json({data: books});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// borrow book
exports.borrowBook = async (req, res) => {
  try {
    const { code, bookCode, borrowedDate } = req.body;

    const member = await Member.findOne({ code });
    // penalty date validation
    if (member.penaltyEndDate && new Date(member.penaltyEndDate) < borrowedDate) {
      member.penaltyEndDate = null;
      await member.save();
    }

    // status validation
    const memberValidation = utils.validateMember(member);
    if (!memberValidation.isValid) {
      return res.status(memberValidation.status).json({ message: memberValidation.message, endPenalty: memberValidation.endPenalty });
    }

    // get book from db
    const book = await Book.findOne({ code: bookCode });
    if (!book || book.borrowedBy || book.stock === 0) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    // borrowed data
    book.borrowedBy = member._id;
    book.borrowDate = borrowedDate;
    book.stock -= 1; // decrease every borrowed book
    await book.save();

    member.borrowedBooks.push(book._id);
    await member.save();

    res.status(200).json({ message: 'Book is borrowed', book });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// return book
exports.returnBook = async (req, res) => {
  try {
    const { code, bookCode, returnedDate } = req.body;

    // validationn
    const member = await Member.findOne({ code });
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const book = await Book.findOne({ code: bookCode, borrowedBy: member._id });
    if (!book) {
      return res.status(400).json({ message: 'This member has not borrowed this book' });
    }
    if (new Date(book.borrowDate) > new Date(returnedDate)) {
      return res.status(400).json({ message: 'Returned Date is invalid, must be newer than Borrowed Date' });
    }

    // checking returned status && validation
    const daysBorrowed = utils.calculateDaysDifference(book.borrowDate, returnedDate);
    if (daysBorrowed >= 7) {
      const penaltyDate = utils.addPenaltyDays(returnedDate, 3);
      member.penaltyEndDate = penaltyDate;

      book.borrowedBy = null;
      book.borrowDate = null;
      book.stock += 1;
      await book.save();

      member.borrowedBooks = member.borrowedBooks.filter(
        (bookId) => bookId.toString() !== book._id.toString()
      );
      await member.save();

      return res.status(200).json({ message: 'Book returned is late, penalized member for 3 days', book });
    }

    book.borrowedBy = null;
    book.borrowDate = null;
    book.stock += 1;
    await book.save();

    member.borrowedBooks = member.borrowedBooks.filter(
      (bookId) => bookId.toString() !== book._id.toString()
    );
    await member.save();

    res.status(200).json({ message: 'Book is returned', book });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add new book
exports.addNewBooks = async (req, res) => {
  try {
    const { code, title, author, stock } = req.body;

    // Check if the book already exists
    const existingBook = await Book.findOne({ code });
    if (existingBook) {
      return res.status(400).json({ message: 'Book already exists' });
    }

    const newBook = new Book({ code, title, author, stock });
    await newBook.save();

    res.status(201).json({ message: 'New book added', book: newBook });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an existing book
exports.deleteExistBook = async (req, res) => {
  try {
    const { code } = req.params;

    const book = await Book.findOneAndDelete({ code });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted', book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};