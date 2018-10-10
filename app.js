const express = require('express')
var app = express()
var validate = require('express-validator');
var url = require('url');
const path = require('path');
var mysql = require("mysql");
const bodyParser = require('body-parser');
var uuid = require('uuid')
var moment = require('moment');
const methodOverride = require('method-override');
var images = [{image: "/images/bg2.jpg"}];
var con = mysql.createConnection({
  host: "34.204.52.29",
  user: "khana",
  password: "wRMHtXjybup932HR",
  database: "interview8"
});
app.use(validate());
app.use(methodOverride('_method'));
app.listen(3086, () => {
    console.log("Listening on server 3085 setup localhost")
  })
  app.use(methodOverride('_method'));
  app.use(express.static(path.join(__dirname + '/common')));
  app.set('views', __dirname+ '/views');
app.set('view engine', 'ejs')
app.get('/admin', function(req, res){
  res.sendFile(path.join(__dirname + '/common/public' + '/index.html'));
})
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/common/public' + '/index.html'));
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.get('/home', function(req, res, next){
  res.render('master', {image:images});
});
app.get('/search', function(req, res, next){
  res.render('searchuser');
}); 
app.get('/users', function(req, res, next) {
  con.connect(function(error, conn) {
      con.query('SELECT * FROM tblAuctionUser ORDER BY id DESC',function(err, rows, fields) {
          if (err) {
              res.render('searchuser', {
              })
          } else {
              res.render('index', {
                  title: 'Admin List', 
                  data: rows
              })
          }
      })
  })
})
/*app.post('/search', function(req, res) {
  var recieved = req.body.id;
  console.log(recieved);
  con.connect(function(err) {
    if(err) throw err;
        else { 
          var query = "SELECT * FROM tblAuctionUser where username = 'atefkhan2833'";
          con.query(query, recieved, function(err, rows, fields) {
            if (err) {
              console.log(err);
                res.render('searchuser', {
                })
            } else {
             console.log(rows);
                res.render('displayInformation', { 
                    data: rows
                })
            }
        })
        }
    });
});
*/
app.get('/add', function(req, res, next){
  res.render('adduser');
});
app.post('/add', function(req, res, next){
  var uniqueID = uuid.v1();
  var timeStamp = moment();
  var data = { id: uniqueID,
   first_name: req.body.first_name,
   last_name: req.body.last_name,
   date_of_birth: req.body.date_of_birth,
   email: req.body.email,
   username: req.body.username,
   pass_hash: req.body.pass_hash,
    user_created_date: timeStamp
  };
con.connect(function(err){
    var query = con.query("INSERT INTO tblAuctionUser set ? ",data, function(err, rows){
      if(err){
        console.log(err);
      }
      res.redirect('/home');
});
});
});
app.get('/edit/:id', function(req, res, next){
  var recieved = req.params.id;
  console.log(recieved);
  con.connect(function(error, conn) {
    var query = "SELECT * FROM tblAuctionUser WHERE id = ?";
      con.query(query, recieved, function(err, rows, fields) {
          if(err) throw err
        
          if (rows.length <= 0) {
              req.flash('error')
              res.redirect('/home')
          }
          else { 
              res.render('edituser', {
                  title: 'Edit User',
                  id: rows[0].id,
                  first_name: rows[0].first_name,
                  last_name: rows[0].last_name,
                  date_of_birth: rows[0].date_of_birth,
                  email: rows[0].email,
                  username: rows[0].username,
                  pass_hash: rows[0].pass_hash                  
              })
          }            
      })
  })
})
app.post('/edit/:id', function(req, res, next) {

    req.assert('first_name', 'Name is required').notEmpty()           
  req.assert('last_name', 'Age is required').notEmpty()            
  req.assert('date_of_birth', 'A valid date of birth is required').notEmpty()
  req.assert('email', 'Age is required').isEmail()       
  req.assert('username', 'Username is required').notEmpty()       
  req.assert('pass_hash', 'Password is required').notEmpty()       
  req.assert('last_name', 'Age is required').notEmpty()       
  var errors = req.validationErrors()
  
  if( !errors ) {         
      con.connect(function(error, conn) {
      
          con.query('UPDATE tblAuctionUser SET first_name =?, last_name =?, date_of_birth=?,email=?, username=?, pass_hash=? WHERE id = ?', 
          [req.body.first_name, 
            req.body.last_name, 
            req.body.date_of_birth, 
            req.body.email, 
            req.body.username, 
            req.body.pass_hash, 
            req.params.id], function(err, result) {
            
              if (err) {
               console.log(err);
              } else {
                  
                console.log()
                res.render('master', { 
                  
                })
              }
          })
      })
  }
  else {   
      var error_msg = ''
      errors.forEach(function(error) {
          error_msg += error.msg + '<br>'
      })
      
    
      res.render('searchuser', { 
      })
  }
})
app.get('/delete/:id', function(req, res, next){
  var recieved = req.params.id;
  var deleteQuery = "DELETE FROM tblAuctionUser WHERE id = ?";
  con.query(deleteQuery, recieved, function(err,results)
{
  if(err)

{ 
  return console.log(err);
}})
  res.redirect('/home');
});