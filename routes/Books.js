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
 *     summary: Get unborrowed books / all available books
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
 *         description: Book added successfully
 */
router.post('/', booksController.addNewBooks);

/**
 * @swagger
 * /books/{code}:
 *   delete:
 *     summary: Delete a book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
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
 *         description: Book borrowed successfully
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
 *         description: Book returned successfully
 */
router.post('/return', booksController.returnBook);

module.exports = router;