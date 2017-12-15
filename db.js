var mysql = require('mysql');

var db = mysql.createPool({  //创建数据库的连接池
	host : 'localhost',
	user : 'root',
	password : 'admin',
	database: 'ueditor'
});

module.exports = db;