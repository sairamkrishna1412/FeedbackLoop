const express = require('express');
const router = express.Router();

const creditController = require('../controllers/creditController');

router.post('/add', creditController.addCredits);

module.exports = router;
