const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId} = Schema.Types

const subSchema = new Schema({
    userId:{type:ObjectId, required:true, index:1},
    url:{type:String, required:true}
})

const subModel = mongoose.model('sub', subSchema)  //这一行的作用基本上使得subModel类似等于db.subs

async function insert(sub) {
    const sub = await subModel.create(sub)
    return sub
}

async function list(params) {
    const match = {}
    const flow = subModel.find(match)
    const sub = await flow.exec()
    return sub
}

async function findByUserId(userId) {
    const subs = await subModel.find({userId})
    return subs
}

module.exports ={
    insert,
    list,
    findByUserId
}