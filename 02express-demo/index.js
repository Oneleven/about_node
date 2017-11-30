const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
server.listen(7788)

//请求路径http://localhost:7788/user?username=tom&b=3#hash
// function test(req,res,next){
//     console.log(req.query)  //{username:'tom',b:3} ,req.query自动帮你解析query里面的内容变成对象
//     if(req.query.username === 'tom'){
//         console.log('tom')
//         next()
//     }else{
//         res.end('it\'s wrong')
//     }
// }

// app.use(test)  //app.use里面接收的是一个函数参数

//-----------注意：exports是module.exports的引用！指向的是module.exports的地址。如果exports={}，那就直接是新的內存
//  var c = require('./middlewares/a') 
//  console.log(c)

//-----------

//中间件以及错误处理
// app.use(require('./middlewares/test'))

// app.use((req,res,next)=>{
//     req.age = 18
//     console.log('mw1')
//     next()  //如果这里不调用next()函数，没有res.end ， res.send(), res.json({a:1}), 网页端就得不到响应
//     //res.end('hello express-demo')
// })

// app.use((req,res,next)=>{
//     next('这里出错了！')  //next里面包含字符串的信息就会被错误处理机制的中间件获取，并且停止往下。
//     //next({出错了:'yes'})  //可以是对象，也可以是字符串
// })

// app.use((req,res,next)=>{
//     console.log(req.age)  //18,说明中间件里面的请求和响应共用的，线性往下通过next()来执行。
//     console.log('mw2')
//     res.end('yes')
//     //res.json({a:1})
// })

// app.use((err,req,res,next)=>{   //错误处理需要4个参数，不能遗漏
//     console.log(err)
//     //res.end(err)
// })

//路由
const bodyParser = require('body-parser')  //中间件，需要安装，npm i --save body-parser，它帮我们处理了之前req.on里data和end里处理数据的事情
app.use(bodyParser.json())    //body-parser需要调用一下，可以解析json格式
app.use(bodyParser.urlencoded({extended:true}))  //可以解析urlencoded格式，ture->使用queryString库（默认） false->使用qs库。
// extend:true后可以解析数组或者对象，users[0]=123&users[1]=456
//                                  users[age]=18&users[name]='tom'


function mw1(){
    return function(req,res,next){
        console.log('mw1')
        //console.log(req.body)  //如果不调用body-parser,打印出来undefined；调用之后打印出来对象格式{}
        next()
    }
}

function mw2(req,res,next){
    console.log('mw2')
    next()
}

function mw3(req,res,next){
    console.log('mw3')
    res.end('done')
}

//app.use(mw1(),mw2,mw3)  //也可以app.use([mw1(),mw2],mw3),这里任何请求都会走到对应的中间件去执行，没有区分，不管是GET请求还是POST请求。
app.use('/',mw1())
app.use('/user',mw2)
app.get('/',mw3)