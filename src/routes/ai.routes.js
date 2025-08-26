const express = require('express');
const router = express.Router();
const aiController = require('../controller/ai.controller');


router.post('/call', aiController.callModel)

module.exports = router;