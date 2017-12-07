const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('./services/mongodb_connection');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup，这里是设置模板引擎，ejs是支持html语言的模板引擎（后端渲染）
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // 引擎的地址

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //表示静态文件，放进去就会拿到


//app.use('/',require('./routes/router'))  //引用自建的router.js
app.use('/', index);
app.use('/user', users); // 第一个参数是访问路径，第二个是router的路径

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
