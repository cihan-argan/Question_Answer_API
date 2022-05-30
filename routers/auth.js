//Routers > auth.js
const express = require('express');
// /api/auth
const router = express.Router();
const { register } = require('../controllers/auth');

router.post('/register', register);

//kullanabilmek için
module.exports = router;
