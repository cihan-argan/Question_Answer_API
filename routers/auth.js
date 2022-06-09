//Routers > auth.js
const express = require('express');
// /api/auth
const router = express.Router();
const { register, login, getUser, logout } = require('../controllers/auth');
const { getAccessToRoute } = require('../middlewares/authorization/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getAccessToRoute, getUser);
router.get('/logout', getAccessToRoute, logout);

//kullanabilmek için
module.exports = router;
