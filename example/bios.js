var express = require('express');
var Rasta   = require('rasta');

var app = express();

app.configure(function () {
    app.use(express.compress());
    app.use(express['static'](__dirname + '/public'));
    app.use(express.bodyParser());
});

var bioDir = ('bios');

var rasta = new Rasta(app, bioDir);

app.listen(3000);

console.log("port 3000's so rasta, man")