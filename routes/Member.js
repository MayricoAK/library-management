const express = require('express');
const router = express.Router();
const { 
    getAllMembers, 
    getBorrowedBooksCount, 
} = require('../controllers/Member');

router.get('/', getAllMembers);
router.get('/:code', getBorrowedBooksCount);

module.exports = router;