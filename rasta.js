var marked  = require('meta-marked');
var walk    = require('walk');
var sugar   = require('sugar');
var fs      = require('fs');
var _       = require('underscore');
var endsWith  = sugar.endsWith;

marked.setOptions({
  breaks: true,
  smartypants: true
})

function Rasta (dir) {
  this._dataSet = [];
  if (dir) this.addDirectory(dir);
}

Rasta.prototype.addFile = function (path, callback) {
  var dataSet = this._dataSet;
  
  fs.readFile(path, 'utf8', function (err, data) {
    var itemData = marked(data);
    dataSet.push(itemData);
  })

  callback();
}

Rasta.prototype.addDirectory = function (dir, callback) {
  var walker = walk.walk(dir);
  var self = this;

  walker.on('file', function (dir, file, next) {
    if (file.name.endsWith('.md')) {
      self.addFile(dir + '/' + file.name, next);
    }
    else { 
      console.log('next');
      next(); 
    }
  });
  
  walker.on('end', function () {
    if (callback) callback(null, self.all())
  });

};

Rasta.prototype.all = function () {
  return this._dataSet.slice();
}

Rasta.prototype.getBySlug = function (slug) {
  return _.find(this._dataSet, function (item) {
    if (item.meta.slug === slug) return true;
  });
};

module.exports = Rasta;
