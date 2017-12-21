var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ueditor = require("ueditor");
var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//跨域，一定要在注册路由之前！！！！！！！！
app.use(cors({
  origin:['http://localhost:8080'],
  methods:['GET','POST'],
  alloweHeaders:['Content-Type', 'Authorization']
}));

app.use('/', index);
app.use('/users', users);



//使用模块
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
  console.log(path.join(__dirname, 'public'));
  // ueditor 客户发起上传图片请求
  //if (req.query.action === 'uploadimage') {
  //  var foo = req.ueditor;
  //  var imgname = req.ueditor.filename;
  //
  //  var img_url = '/images/ueditor/';
  //  res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
  //  res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
  //}
  ////  客户端发起图片列表请求
  //else if (req.query.action === 'listimage') {
  //  var dir_url = '/images/ueditor/';
  //  res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
  //}
  var imgDir = '/images/ueditor/'; //默认上传地址为图片
  var videoDir = '/video/ueditor';
  var ActionType = req.query.action;
  if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
    var file_url = imgDir;//默认上传地址为图片
    /*其他上传格式的地址*/
    if (ActionType === 'uploadfile') {
      file_url = '/file/ueditor/'; //附件保存地址
    }
    if (ActionType === 'uploadvideo') {
      file_url = '/video/ueditor/'; //视频保存地址
    }
    res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    res.setHeader('Content-Type', 'text/html');
  }
  //客户端发起图片列表请求
  else if (ActionType === 'listimage'){
    res.ue_list(imgDir);  // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端发起其它请求
  else {
    // console.log('config.json')
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/ueditor/ueditor.config.json');
  }
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
