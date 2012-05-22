
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var schema = new Schema({ sku: 'string' });
module.exports = exports = mongoose.model('Order', schema);
