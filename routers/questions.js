//Question.js
const express = require('express');
// /api/questions
const router = express.Router();

router.get('/', (req, res) => {
	res.status(404).json({
        success:false
    })
});

// /api/questions/delete
router.get('/delete', (req, res) => {
	res.send('Questions Delete Page');
});
//kullanabilmek için
module.exports = router;
