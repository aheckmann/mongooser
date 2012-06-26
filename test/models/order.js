
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var schema = new Schema({ sku: String });
module.exports = exports = mongoose.model('Order', schema);
