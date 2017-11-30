module.exports = function test(req,res,next){
    console.log(req.query)  //{username:'tom',b:3} ,req.query自动帮你解析query里面的内容变成对象
    if(req.query.username === 'tom'){
        console.log('tom')
        next()
    }else{
        res.end('it\'s wrong')
    }
}
