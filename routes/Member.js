const express = require('express');
const router = express.Router();
const memberController = require('../controllers/Member');

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Get all members
 *     responses:
 *       200:
 *         description: List of members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 */
router.get('/', memberController.getAllMembers);

/**
 * @swagger
 * /members:
 *   post:
 *     summary: Add a new member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       201:
 *         description: Member added successfully
 */
router.post('/', memberController.addNewMember);

/**
 * @swagger
 * /members/{code}:
 *   get:
 *     summary: Get detail of specified member
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detail of specified member
 */
router.get('/:code', memberController.getDetailMember);

/**
 * @swagger
 * /members/{code}:
 *   delete:
 *     summary: Delete a member
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member deleted successfully
 */
router.delete('/:code', memberController.deleteExistMember);

module.exports = router;