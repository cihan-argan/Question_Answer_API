const express = require('express');
const { getSingleUser } = require('../controllers/user.js');
const { checkUserExist } = require('../middlewares/database/databaseErrorHandler');

const router = express.Router();

router.get('/:id', checkUserExist, getSingleUser); //dynamic olarak id alacağız.

module.exports = router;
