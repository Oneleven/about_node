const mongoose = require('mongoose');

mongoose.Promise = Promise;

const uri = `mongodb://localhost:27017/daodao`;

const connection = mongoose.connect(uri, { useMongoClient: true });

const db = mongoose.connection;  //db对象就是和数据库的连接。连接的状态统一在connection这个对象中

const Schema = mongoose.Schema; //Schema表示数据表里面字段的规范，约定

const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  name: {type:String, required: true, unique:true, index: 1 }, //index表示顺序,required表示名字是必须的，插入对象中没有名字的话会报错
  age: {type: Number, max: 188, min: 18 } //min:[18,'you are too young!'],插入的数据小于18岁就会报错，错误内容是这个字符串里的信息
});

const UserModel = mongoose.model('user',UserSchema);
//这里第一个参数是collection，会默认改成复述

//增
// (async ()=> {
//   const user = await UserModel.create({   //创建一个对象,这个在mongodb里面相当于db.users.insertOne({})
//     name: "xiaosheng",
//     age: 89
//   });
//   return user
// })().then(r => {
//   console.log(r)
// }).catch(e=> {
//   console.log(e)
// })

//查找
//   (async ()=>{
//     const user = await UserModel.find({   //mongoose的find()返回一个数组 / findOne()返回一个对象 和mongdb一样
//       name:"xiaosheng"
//     })
//     return user
// })()
//   .then(r=>{
//     console.log(r)
//   })
//   .catch(e=>{
//   console.log(e)
//   })


//更新
// (async()=> {
//   const user = await UserModel.update({   //这里的update和 mongdb有一点不一样，第二个参数不用必须写{$set：}
//     name: "xiaosheng" },{age: 123123123},{multi:true})
//   //UserModel.findOneAndUpdate({name:"xiaosheng"},{age:23423},{new:true}) 这里第三个参数在mongdb里面是returnNewDocument:true
//   return user
// })().then(r=> {
//   console.log(r)
// }).catch(e=> {
//   console.log(e)
// })


//
(async (params) => {
  const filter = {}
  if (params.name) filter.name = params.name

  const flow = UserModel.find(filter)

  if (params.projection) flow.select(params.projection)

  if (params.sort) flow.sort(params.sort)

  const users = await flow.exec()

  return users
})({
  name:"xiaosheng",
  projection:{age:1},
  //sort:{age:1} 或者下面这种写法
  sort:"-age"
})
.then(r => {
  console.log(r)
})
.catch(e => {

})

db.on('open', () => {
  console.log('db connected!');
 // console.log(user)
});

db.on('error', (e) => {
  console.log('e')
});