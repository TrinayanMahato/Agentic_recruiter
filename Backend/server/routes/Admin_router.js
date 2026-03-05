const express = require('express');
const { connectAdminStream } = require('../controller/Admin_controller.js');

const router = express.Router();

router.get('/stream/:id', connectAdminStream);

module.exports = router;