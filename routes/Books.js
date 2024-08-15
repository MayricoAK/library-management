const express = require('express');
const router = express.Router();
const booksController = require('../controllers/Books');

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: List of all existing books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', booksController.getAllBooks);

/**
 * @swagger
 * /books/available:
 *   get:
 *     summary: Get unborrowed books / available books
 *     responses:
 *       200:
 *         description: List of available books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/available', booksController.getAvailableBooks);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: New book added
 *       400:
 *         description: Book already exists
 */
router.post('/', booksController.addNewBooks);

/**
 * @swagger
 * /books/{code}:
 *   delete:
 *     summary: Delete a book
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 */
router.delete('/:code', booksController.deleteExistBook);

/**
 * @swagger
 * /books/borrow:
 *   post:
 *     summary: Borrow a book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               bookCode:
 *                 type: string
 *               borrowedDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Book is borrowed
 *       400:
 *         description: Member cannot borrow more than 2 books / Member is currently penalized / Book is not available
 *       404:
 *         description: Member not found
 */
router.post('/borrow', booksController.borrowBook);

/**
 * @swagger
 * /books/return:
 *   post:
 *     summary: Return a book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               bookCode:
 *                 type: string
 *               returnedDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Book is returned / Book returned is late, penalized member for 3 days
 *       400:
 *         description: This member has not borrowed this book / Returned Date is invalid, must be newer than Borrowed Date
 *       404:
 *         description: Member not found
 */
router.post('/return', booksController.returnBook);

module.exports = router;