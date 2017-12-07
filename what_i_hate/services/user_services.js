//const User = require('../models/in_memo/user')
const User = require('../models/mongoose/user')
const Subscription = require('../models/in_memo/subscription')

// module.exports.getAllUsers = function () {
//   return User.list();
// }

// module.exports.addNewUser = function (firstName, lastName, age) {
//   return User.insert(firstName, lastName, age);
// }

// module.exports.getUserById = function (userId) {
//   return User.getOneById(userId);
// }

// module.exports.createSubscription = function (userId, url) {
//   const user = User.getOneById(userId);
//   if(!user) throw Error('No such user!');
//   const sub = Subscription.insert(userId, url);
//   return sub;
// }


//mongoose

module.exports.getAllUsers = async function () {
  const users = await User.list()
  return users
}

module.exports.addNewUser = async function (name, age) {
  const user = await User.insert({
    name,
    age
  });
  return user
}

module.exports.getUserById = async function (userId) {
  const user = await User.getOneById(userId);
  return user
}

module.exports.createSubscription = async function (userId, url) {
  const user = await User.getOneById(userId);
  if(!user) throw Error('No such user!');
  const sub = Subscription.insert(userId, url);
  return sub;
}