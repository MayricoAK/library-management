const express = require('express');
const router = express.Router();
const booksController = require('../controllers/Books');

router.get('/', booksController.getAvailableBooks);
router.post('/', booksController.addNewBooks);
router.delete('/:id', booksController.deleteExistBook);
router.post('/borrow', booksController.borrowBook);
router.post('/return', booksController.returnBook);

module.exports = router;