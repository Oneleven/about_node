// import { request } from 'http';
// import { userInfo } from 'os';

const express = require('express');

const router = express.Router();

// const User = require('../models/in_memo/user.ejs')
/* GET users listing. */
// router.get('/', (req, res) => {
//   const u = new User(req.query.firstName,req.query.lastName,req.query.age)
//   console.log( res.locals.user)
//   res.locals.user = u
//   res.render('user')
// });

// -------------演示services

const UserService = require('../services/user_services');

router.get('/', (req, res) => {

  (async ()=>{
    const users = await UserService.getAllUsers();
    res.locals.users = users;
    res.render('users');
  })()
    .then(r=>{
      console.log(r)
    })
    .catch(e=>{
  
    })

  
});

router.post('/', (req, res) => {
  const { firstName, lastName, age } = req.body;
  // console.log(req.body)
  const u = UserService.addNewUser(firstName, lastName, age);
  res.json(u);
});

router.get('/:userId', (req, res) => { // /:userId表示会被参数处理
  // console.log(req.params.userId);
  const user = UserService.getUserById(Number(req.params.userId)); // 可以取到/:userId,url里面默认的是字符串，这里要转化一下
  // console.log(user)
  res.locals.user = user;
  res.render('user');
});

router.post('/:userId/subscription', (req, res,next) => { // /:userId表示参数
  try {
    const sub = UserService.createSubscription(Number(req.params.userId), req.body.url);
    res.json(sub);
  } catch (e) {
    next(e)
  }

});

module.exports = router;



















