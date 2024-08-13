const express = require('express');
const router = express.Router();
const { 
    getAllAvailableBooks, 
    borrowBook, 
    returnBook
} = require('../controllers/Books');

router.get('/', getAllAvailableBooks);
router.post('/borrow', borrowBook);
router.post('/return', returnBook);

module.exports = router;