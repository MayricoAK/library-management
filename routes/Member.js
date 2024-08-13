const express = require('express');
const router = express.Router();
const memberController = require('../controllers/Member');

router.get('/', memberController.getAllMembers);
router.post('/', memberController.addNewMember);
router.delete('/', memberController.deleteExistMember);
router.get('/:code', memberController.getBorrowedBooksCount);

module.exports = router;