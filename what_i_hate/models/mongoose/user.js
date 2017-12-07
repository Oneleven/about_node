const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name:{type:String, required:true, index:1},
    age:{type:Number, min:0, max:120},
    firstName:{type:String, required:true},
    lastName:{type:String, required:true}
})

const UserModel = mongoose.model('user', UserSchema)  //这一行的作用基本上使得userModel类似等于db.users

async function insert(user) {
    const user = await UserModel.create(user)
    return user
}

async function getOneById(id) {
    const id = await UserModel.findOne({_id:id})
    return id
}

async function getOneByName(name) {
    const name = await UserModel.findOne({name})
    return name
}

async function list(params) {
    const match = {}
    const flow = UserModel.find(match)
    const user = await flow.exec()
    return user
}

module.exports ={
    insert,
    getOneById,
    getOneByName,
    list
}