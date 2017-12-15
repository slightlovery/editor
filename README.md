# editor
nodejs+express+ejs的百度editor富文本编辑器的使用

使用百度ueditor编辑器--所见即所得

UEditor是由百度web前端研发部开发所见即所得富文本web编辑器，具有轻量，可定制，注重用户体验等特点。在后台使用ueditor可以很方便的编辑文章，只需要更改设置就可以配置上传图片和视频的路径，根据相应的方法可以在前端页面原样输出文章。

官网：http://ueditor.baidu.com/website/index.html

node express + ejs：
1.安装模块：npm install ueditor --save

2.将module中的ueditor文件夹中的public复制到项目的public下：（如果报错则需要复制jsp中的某个文件夹过来）

3.在app.js中使用模块

var ueditor = require("ueditor");

//使用模块
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
  // ueditor 客户发起上传图片请求
  if (req.query.action === 'uploadimage') {
    var foo = req.ueditor;
    var imgname = req.ueditor.filename;
    var img_url = '/images/ueditor/';
    res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    res.setHeader('Content-Type', 'text/html');//IE8下载需要设置返回头尾text/html 不然json返回文件会被直接下载打开
  }
  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage') {
    var dir_url = '/images/ueditor/';
    res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端发起其它请求
  else {
    // console.log('config.json')
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/ueditor/jsp/config.json');
  }
}));

4.在ueditor.config.js中配置服务器接口路径

// 服务器统一请求接口路径
, serverUrl: 'http://localhost:3000/ueditor/'+'ue'
最终上传的图片将会保存在app.js设置的路径下


5.接下来就可以在页面中使用ueditor

<div style="width: 1200px;margin: 0 auto">
  <script id="editor" type="text/plain" style="width:1200px;height:500px"></script>
</div>

接下来就可以在script中进行操作
//实例化编辑器
//建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
var ue = UE.getEditor('editor');
data.content = ue.getContent();

getContent()方法可以获取到ue的内容的html代码，将其POST到服务器处理保存到数据库中。
var sql = `INSERT INTO news (title, content) VALUES ('${title}' , '${content}')`;

之后在前端页面需要显示原本页面时直接从数据库中取出content值就可以原样输出了。
db.query(`SELECT * FROM news`,(err, data)=>{
    if (err) {
        res.status(500).send('Database Error', err).end();
    } else {
        res.render('test.ejs', {result: data});
    }
});

ejs页面中：
var str = '<%- result[1].content %>';
$('#div1').append(str);

注意：ejs的 <%- %>和 <%= %>的区别，不然会转义。
