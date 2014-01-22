var logger      = require('bucker').createLogger();
var sugar       = require('sugar');
var util        = require('util');
var fs          = require('fs')
var _           = require('underscore');
var ParseBios  = require('./ParseBios');

function Views (bioDir) {

    var self = this;

    console.log('Views bioDir:', bioDir);

    var parseBios  = new ParseBios(bioDir);

    var bioData;

    function loadBios(bios) {
        self.bioData = bios;
    };

    // parse and load the bios into memory
    parseBios.on('ready', function (bios, bioDir) {
        loadBios(bios);
    });

    parseBios.on('update', function (bios, bioDir) {
        loadBios(bios);
    });

    parseBios.setup(bioDir);

    console.log('bioData', bioData);

};

Views.prototype.team = function (req, res) {
    var self = this;
    // console.log('list', this);

    res.render('team', { 
        bios: self.bioData
    });
};

Views.prototype.teamMember = function (req, res) {

    var self = this;

    // logger.info(this);

    // logger.info('bio view bioDir', bioDir);

    logger.info('views.teamMember');

    var thisSlug = req.params.slug;

    // console.log('this.bioData:', this.bioData);

    var thisBio = _.findWhere(this.bioData, {slug: thisSlug });

    res.render('teamMember', {
        image: thisBio.image,
        name: thisBio.name,
        title: thisBio.title,
        content: thisBio.content,
        bios: self.bioData
    });
};

// 404
Views.prototype.notFound = function (req, res) {
    logger.info('views.notFound');
    res.render('404', {status: 404, bodyId: 'fourohfour'});
};


module.exports = Views;