const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { getSingleUser, getAllUsers } = require('../controllers/user.js');
const { checkUserExist } = require('../middlewares/database/databaseErrorHandler');
const userQueryMiddleware = require('../middlewares/query/userQueryMiddleware');

router.get('/', userQueryMiddleware(User), getAllUsers);
router.get('/:id', checkUserExist, getSingleUser); //dynamic olarak id alacağız.

module.exports = router;
