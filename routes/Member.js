const express = require('express');
const router = express.Router();
const { 
    getAllMembers, 
    getBorrowedBooksCount, 
} = require('../controllers/Member');

router.get('/', getAllMembers);
router.get('/:memberId/borrowed-books-count', getBorrowedBooksCount);

module.exports = router;