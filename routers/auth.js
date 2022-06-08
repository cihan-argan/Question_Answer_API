//Routers > auth.js
const express = require('express');
// /api/auth
const router = express.Router();
const { register, tokentest } = require('../controllers/auth');
const { getAccessToRoute } = require('../middlewares/authorization/auth');

router.post('/register', register);
router.get('/tokentest',getAccessToRoute, tokentest);

//kullanabilmek için
module.exports = router;
