// model层是用来处理数据的
// const users = [];

class User {
  constructor(firstName, lastName, age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    User.id += 1;
    this.id = User.id;
  }

  getName() {
    return `${this.firstName} ${this.lastName}`;
  }

  static insert(firstName, lastName, age) {
    const u = new User(firstName, lastName, age);
    User.users.push(u);
    return u;
  }

  static getOneByName(firstName, lastName) {
    return User.users.find((u) => {
      return u.firstName === firstName && u.lastName === lastName;
    });
  }

  static getOneById(userId) {
    return User.users.find(u => u.id === userId);
  }

  static list() {
    return User.users;
  }

  // static get ['users'](){
  //     return users
  // }
  // static get users() {
  //   return users;
  // }
}

User.users = [];
User.id = 0;
module.exports = User;


// console.log(User.list())
// console.log(User.insert('ton','tom',10))
// console.log(User.list())

// console.log(User.insert('mm','n',45))
// console.log(User.list())
// console.log(User.getOneByName('mm','n'))


