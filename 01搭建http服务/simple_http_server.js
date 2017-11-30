//URL Uniform Resource Locator 统一资源定位符
//Schema://host:port/path?query#hash
//协议：主机名：端口号／位置？a=1&b=2 （域名DNS Domain Name System 域名和ip地址相互映射的系统）
// 常用的端口号有 22 ssh服务 ／ 80：http服务 ／ 443:https ／ 27017:mongodb
//localhost === 127.0.0.1



const http = require('http')
const server = http.createServer()
server.listen(8801)
const qs = require('querystring')  //querystring.parse(str, [sep], [eq], [options]) str是字符串，sep为分隔符，默认'&',eq为赋值符，默认为'=' ;最后的结果返回一个对象
//const a = qs.parse('foo=bar&baz=qux&baz=quux&corge')  ==> { foo: 'bar', baz: ['qux', 'quux'], corge: '' }

let users = []  //坑：这个变量之前放在了server.on的作用域里面，每次接受请求，都会重新设置一个空数组[]，因此get发送不出去post请求是push到数组里的东西！！

server.on('request', (req, res) => {   //每接收一次请求，后面的方法就会被调用一次
    // console.log(req.url)   //req.url就是指／path?a=b&c=d
    const { url } = req

    const queryString = url.substring(url.indexOf('?') + 1, url.length) //String.prototype.substring(indexStart[, indexEnd]),(2,5)注意5这个index取不到!!!!
    const query = qs.parse(queryString)                            //string.prototype.substr(start[, length])
    //console.log(query)
    //console.log(url)

    //解析localhost:8800/hello?i_need_money=true&how_much=700  //坑：注意8800之前是没有//的！！！
    //let resStr
    // if(url.indexOf('/hello') > -1){    //坑：这里url后面的字符串里要加/  ，可以if(rul.indexOf('/hello')>-1),表示字符串里存在，加>-1的原因是数字!==true
    //     if(query.i_need_money==='true' && Number(query.how_much)> 500){
    //         resStr = '土豪'
    //     }else{
    //         resStr = '瘪三'
    //     }
    // }else if(url.indexOf('/bye')>-1){
    //     resStr = 'Fuck off'
    // }else{
    //     resStr = 'err'
    // }


    //请求 和 响应 HTTP请求方法：GET:获取所有用户 POST：创建用户 PATCH：修改用户信息 PUT：创建 DELETE OPTIONS：列举可进行的操作 HEAD：返回head信息
    //请求行：方法 /路径 / 协议/版本号（HTTP/1.1）
    //请求头：一些键值对： Content-Type:请求体的类型（编码，格式等）
    //                   Content-Length:请求体的长度 、 Accept:能够接受的返回体类型
    //                   Cookie:cookie  a=1;b=2 cookie约定的文本格式
    // HTTP头中常见键值对：
    // Host 指明请求的地址
    // Server 服务器信息
    // Content-Type 请求体的格式,如 xxx/www-url-encoded-form-data application/json
    // Accept: 接受的返回格式
    // Accept-Encoding：接受的请求编码
    // Accept-Language：接受的语言
    // Pragma：兼容http1.0的缓存
    // Cache-Control:缓存策略
    // Via:走过的服务器链路信息
    //空行   请求头和消息体之间会以一个空行作为分隔符号

    //消息体 请求消息体里面的格式，编码通常由请求头里面的Content-Type 来指定，可能会很大（比如说form-data，可以上传文件，对node来说单个机器的进程内存大小在1.3g左右，这里可以用流/buffer来处理）
    //      Content-Type:application/x-www-form-urlencoded 以键值对的形式a=1&b=2
    //      Content-Type:application/json 

    //----------------------------
    // 状态码：
    // 2xx 请求成功 200成功 201创建 202接受 203代理 206部分处理
    // 3XX 重定向 302找到，重定向 304未修改
    // 4xx 客户端错误 400请求内容错误 401无权限 403禁止访问 404你懂的
    // 5xx 服务器错误 500服务器炸了 502网关炸了 503炸几分钟 504超时

    const path = url.substring(0, url.indexOf('?'))
    switch (path) {
        case '/user':
            switch (req.method) {
                case 'GET':
                    res.statusCode = 200
                    res.end(JSON.stringify(users))  //这里要求是字符串，所以要用JSON.stringify()来转换一下
                    break
                case 'POST':   //这里请求的方法一定要大写
                    // let user = {age:Math.floor(Math.random() * 100)}
                    // users.push(user)
                    // //console.log(users)
                    // res.statusCode = 200
                    // res.end(JSON.stringify(user)) 
                    // break


                    //body相关的处理----------------------
                    //const ContentType = req.headers['content-type']  //req.headers 是一个包含头部信息的对象
                    //console.log(req.headers)

                    // 限制格式
                    // if(ContentType !== 'application/json'){
                    //     res.statusCode = 400
                    //     res.end('wrong contentType')
                    // }

                    //let reqBodyStr = ''
                    let count = 0
                    req.on('data', (data) => {           //这里req.on里面的data就是post请求时body里的数据，变成buffer里一小段一小段数据
                        //reqBodyStr += data.toString()    //当请求收到数据的时候，进行处理数据
                        console.log(data)  //打印出来的是一个buffer  <Buffer 7b 0a 09 22 6e 61 6d 65 22 3a 22 74 6f 6d 22 2c 0a 09 22 61 67 65 22 3a 31 34 0a 7d>
                        count++
                    })
                    //这里会

                    req.on('end', () => {                  //当发过来的请求体结束的时候，执行以下命令
                        // let user = JSON.parse(reqBodyStr)
                        // users.push(user)

                        console.log(count)   //打印出来传输一个文件一共有多少个buffer
                        res.statusCode = 200
                        //res.end(JSON.stringify(user))
                        res.end(count + '')  //坑！这里要加上''，因为加了''才会解析出end里面是字符串，否则会报错！！，或者count.toString(),一个效果
                    })
                    break
            }
            break
        default:
            res.statusCode = 404
            res.end('not found')
            break
    }

    // res.statusCode = 200  //巨坑，不需要
    // res.end(resStr)
})

//ifconfig | grep 192 命令查看自己主机的ip地址。ip:8808/hello  一样会出来相应的resStr