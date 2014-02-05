var express = require('express');
var Rasta   = require('rasta');

var app   = express();

app.configure(function () {
    app.use(express.compress());
    app.use(express['static'](__dirname + '/public'));
    app.use(express.bodyParser());
});

app.set('view engine', 'jade');

var rasta = new Rasta(__dirname + '/team');

app.get('/team', function (req, res) {
  var all = rasta.all()
  res.render('team', { all : all });
})

app.get('/team/:slug', function (req, res) {
  var item = rasta.getBySlug(req.params.slug);
  var all = rasta.all();
  console.log('item', item);
  if (item) {
    res.render('teamMember', { person : item.meta, bio : item.html, all : all });
  } else {
    res.send(404)
  }
})

app.listen(3000);

console.log("port 3000's so rasta, man")