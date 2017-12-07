const express = require('express');

const router = express.Router(); // 和app的用法类似



/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
