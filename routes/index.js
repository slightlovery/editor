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

            res.render('test.ejs', {result: data});
        }
    });
});

router.get('/test1',(req,res)=>{
    db.query(`SELECT * FROM news Order By date desc`,(err, data)=>{
        if (err) {
            console.log(err);
            res.status(500).send('Database Error', err).end();
        } else {
            console.log('成功');
            res.send(data);
        }
    });
});

router.get('/test2/:id',(req,res)=>{
    var id = req.params.id;
    db.query(`SELECT * FROM news Where id = '${id}' `,(err, data)=>{
        if (err) {
            console.log(err);
            res.status(500).send('Database Error', err).end();
        } else {
            console.log('成功');
            res.send(data);
        }
    });
});

router.get('/date',(req, res)=>{
    db.query(`SELECT * FROM news ORDER BY date desc`,(err, data)=>{
        if (err) {
            console.log(err);
            res.status(500).send('Database Error', err).end();
        } else {
            console.log('成功');
            res.render('test-sqldate.ejs', {result: data});
        }
    });
});

router.post('/update', (req, res) => {
  var title = req.body.title;
  var content = req.body.content;
  var sql = `INSERT INTO news (title, content,date) VALUES ('${title}' , '${content}', now() )`;
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
