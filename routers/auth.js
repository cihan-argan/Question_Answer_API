//Routers > auth.js
const express = require('express');
// /api/auth
const router = express.Router();
const { register ,errorTest } = require('../controllers/auth');

router.post('/register', register);

//Deneme amaçlı routh error handling konusu için
router.get('/error', errorTest);


//kullanabilmek için
module.exports = router;
