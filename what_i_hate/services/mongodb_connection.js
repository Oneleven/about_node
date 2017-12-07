const mongoose = require('mongoose')

mongoose.Promise = Promise

const uri = `mongodb://localhost:27017/daodao`
mongoose.connect(uri, { useMongoClient: true })
const db = mongoose.connection  //db对象就是和数据库的连接。连接的状态统一在connection这个对象中


db.on('open', () => {
    console.log('db connected')
})

db.on('error', (e) => {
    console.log('e')
})

module.exports = db