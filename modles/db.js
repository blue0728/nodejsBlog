/**
 * Created by Administrator on 2015/3/27 0027.
 */
var settings = require('../settings');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://' +settings.host +':'+ settings.port + '/' + settings.db);

module.exports = mongoose;