var express = require('express');
var router = express.Router();
var db = require('../db.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test',(req,res)=>{
    db.query(`SELECT * FROM news`,(err, data)=>{
        if (err) {
            console.log(err);
            res.status(500).send('Database Error', err).end();
        } else {
            console.log('成功');
            console.log(data[1].content);
            res.render('test.ejs', {result: data});
        }
    });
});

router.post('/update', (req, res) => {
  var title = req.body.title;
  var content = req.body.content;
  var sql = `INSERT INTO news (title, content) VALUES ('${title}' , '${content}')`;
  console.log(sql);
  db.query(sql, (err, data)=>{
        if (err) {
          console.log(err);
          res.status(500).send('Database Error', err).end();
        } else {
          console.log('添加');
          res.redirect('/');
        }
      }
  );
});

module.exports = router;
