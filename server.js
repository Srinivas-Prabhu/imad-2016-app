var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user: 'srinivas-prabhu',
    database: 'srinivas-prabhu',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

var articles = {
    'article-one':{
      title: 'Article One | Srinivas Prabhu ', 
      heading:'article-one',
      date:'Sep 5, 2016',
      content:` 
                    <p>
                        This is the content of the first article.This is the content of the first article.This is the content of the first article.This is the content of the first article.
                    </p>
                    <p>
                        This is the content of the first article.This is the content of the first article.This is the content of the first article.This is the content of the first article.
                    </p>
                    <p>
                        This is the content of the first article.This is the content of the first article.This is the content of the first article.This is the content of the first article.
                    </p>`
    },
    'article-two': {
            title: 'Article Two | Srinivas Prabhu ', 
          heading:'article-two',
          date:'Sep 5, 2016',
          content:` 
                        <p>
                        This is the content of the second article
                        </p>`
    },
   'article-three': {
        title: 'Article Three | Srinivas Prabhu ', 
          heading:'article-three',
          date:'Sep 5, 2016',
          content:` 
                        <p>
                        This is the content of the third article
                        </p>`
    }
};

function createTemplate (data){
    var title = data.title;
    var date =  data.date;
    var heading = data.heading;
    var content = data.content;
    var htmlTemplate = `
    <html>
        <head>
            <title>
                ${title}
            </title>
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
            <body>
                <div class = "container">
                    <div>
                        <a href = "/">HOME</a>
                    </div>
                    <br />
                    <h3>
                        ${heading}
                    </h3>
                    <div>
                        ${date.toDataString()}
                    </div>
                    <div>
                        ${content}
                    </div>
                </div>
            </body>
    </html>
    
    `;

return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/test-db', function(req,res){
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM test', function(err, result) {
       if(err){
           res.status(500).send(err.toString());
       }
       else{
           res.send(JSON.stringify(result.rows));
       }
   });
});


var counter = 0;
app.get('/counter', function(req,res){
   counter = counter + 1;
   res.send(counter.toString());
});
var names=[];
app.get('/submit-name', function(req,res){
  var name = req.query.name;
   names.push(name);
   res.send(JSON.stringify(names));
});

app.get('/articles/:articleName', function (req,res){
    
    pool.query("SELECT * FROM article WHERE title = " + req.params.articleName + "", function(err, result){
        if(err){
            res.status(500).send(err.toString());
        } else{
            if(result.rows.length === 0){
                res.status(404).send('Article not found');
            }
            else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});



var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
