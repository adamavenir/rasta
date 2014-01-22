var util        = require('util');
var logger      = require('bucker').createLogger();
var Views       = require('./rasta/views');

var bioData;

function Rasta (app, bioDir) {

  var views = new Views(bioDir);

  // use jade
  app.set('view engine', 'jade');

  this.app = app;

  console.log('rasta bioDir', bioDir)

  // bio list
  app.get('/' + bioDir, views.list.bind(views));

  // individual bios
  app.get('/' + bioDir + '/:slug', views.bio.bind(views));

  // 404
  app.get('*', views.notFound.bind(views));

};

module.exports = Rasta;