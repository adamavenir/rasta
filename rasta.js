'use strict';

const marked  = require('meta-marked');
const walk    = require('walk');
const fs      = require('fs');

marked.setOptions({
  breaks: true,
  smartypants: true
})

function Rasta (dir) {
  this._dataSet = [];
  if (dir) this.addDirectory(dir);
}

Rasta.prototype.addFile = function (path, callback) {
  const dataSet = this._dataSet;

  fs.readFile(path, 'utf8', function (err, data) {
    const itemData = marked(data);
    dataSet.push(itemData);
    callback(err);
  });
}

Rasta.prototype.addDirectory = function (dir, callback) {
  const walker = walk.walk(dir);
  const self = this;

  walker.on('file', function (dir, file, next) {
    if (file.name.endsWith('.md')) {
      self.addFile(dir + '/' + file.name, next);
    }
    else {
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
  return this._dataSet.find(function (item) {
    if (item.meta.slug === slug) return true;
  });
};

module.exports = Rasta;
