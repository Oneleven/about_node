const express = require('express');
const router = express.Router(); // 和app的用法类似

router.use('/', (req, res, next) => {
  console.log('mw1');
  next('router'); // 一旦调用这个字符串，就是终止这个router文件继续往下执行，下面的mw2不会被打印出来
});

router.use('/', (req, res, next) => {
  console.log('mw2');
  next();
});

module.exports = router;
