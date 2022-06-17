const express = require('express');
const router = express.Router();
const { getSingleUser, getAllUsers } = require('../controllers/user.js');
const { checkUserExist } = require('../middlewares/database/databaseErrorHandler');

router.get('/', getAllUsers);
router.get('/:id', checkUserExist, getSingleUser); //dynamic olarak id alacağız.

module.exports = router;
