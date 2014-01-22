var EventEmitter = require('events').EventEmitter;
var path        = require('path');
var logger      = require('bucker').createLogger();
var walk        = require('walk');
var sugar       = require('sugar');
var jf          = require('jsonfile');
var util        = require('util');
var fs          = require('fs');
var wtchr       = require('wtchr');
var marked      = require('marked');
var yaml        = require('yamljs');
var _           = require('underscore');

var endsWith = sugar.endsWith;
var startsWith = sugar.startsWith;
var bios = [];
var bioSlug;

marked.setOptions({
  breaks: true,
  smartypants: true,
});

function ParseBios(bioDir) {
    EventEmitter.call(this);
}

ParseBios.prototype = new EventEmitter();

ParseBios.prototype.parseFile = function (bioPath, bioDir, file, callback) {

    // set the slug to the filename
    bioSlug = file.name.remove('.md');

    buildData(bioPath, bioDir, bioSlug);

    // load up the metadata
    function loadMetadata(bioPath, bioDir, file, filename) {

        // console.log('adding metadata for ' + bioDir + ' ' + file + ' ' + filename);
        var metadata = {};
        var bio = [];
        var front_matter = [];

        var in_metadata = false;
        var done = false;
        var lines = file.split(/\n|\r\n/);

        lines.forEach(function (line) {
            if (done) {
                bio.push(line);
            } else if (!in_metadata) {
                if (line.match(/^---/)) {
                    in_metadata = true;
                } else {
                    bio.push(line);
                }
            } else if (in_metadata) {
                if (!line.match(/^---/)) {
                    front_matter.push(line);
                } else {
                    in_metadata = false;
                    done = true;
                }
            }
        });

        front_matter = front_matter.join('\n');
        bio = bio.join('\n');

        metadata = yaml.parse(front_matter);

        return _.extend({}, metadata, {
            dir: bioDir,
            title: metadata.title,
            slug: metadata.slug,
            content: marked(bio)
        });
    }

    // read the metadata and markdown associated with each bio
    function buildData(bioPath, bioDir, bioSlug, bioMarkdown) {
      
        fs.readFile(bioPath + '/' + file.name, 'utf8', function (err, data) {

            var bioData = loadMetadata(bioPath, bioDir, data, file.name);

            // add the metadata to the bio array
            bios.push(bioData);

            // go to the next file
            callback();
        });
    }

    // logger.info(util.inspect(bios));
};

ParseBios.prototype.setup = function (bioDir) {

    var self = this;
  
    var bioPath = require('path').dirname(require.main.filename) + '/' + bioDir;

    var walker = walk.walk(bioPath);

    walker.on("file", function (bioPath, file, next) {
        logger.info('walking files');
        // does the file have a .md extension?
        if (file.name.endsWith('.md')) {
            self.parseFile(bioPath, bioDir, file, next);
        }
        else {
            next();
        }
    });

    walker.on("end", function () {

        // logger.info(util.inspect(bios));

        self.emit('ready', bios, bioPath);
        logger.info('walked, loaded and ready');

        var watcher = wtchr(bioPath);

        watcher.on('create', function (filename) {
            if (!filename.match(/\.md$/)) return;
            var file = filename.replace(bioPath + '/', '');
            logger.debug('adding new file:', file);
            self.parseFile(bioPath, bioDir, { name: file }, function () {
                self.emit('update', bios);
                logger.info('watcher found a new file');
            });
        });

        watcher.on('change', function (filename) {
            if (!filename.match(/\.md$/)) return;
            var file = filename.replace(bioPath + '/', '');
            logger.debug('changing file:', file);
            var bioIndex = bios.indexOf(_.findWhere(bios, { fullSlug: file.replace(/\.md$/, '') }));
            bios.splice(bioIndex, 1);
            self.parseFile(bioPath, bioDir, { name: file }, function () {
                self.emit('update', bios);
                logger.info('watcher found an updated file');
            });
        });

        watcher.on('delete', function (filename) {
            if (!filename.match(/\.md$/)) return;
            var file = filename.replace(bioPath + '/', '');
            logger.debug('deleting file: %s', file);
            var bioIndex = bios.indexOf(_.findWhere(bios, { fullSlug: file.replace(/\.md$/, '') }));
            bios.splice(bioIndex, 1);
            self.emit('update', bios);
            logger.info('watcher found a deleted file');
        });

    });

};

module.exports = ParseBios;