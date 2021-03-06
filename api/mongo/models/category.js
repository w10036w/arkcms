const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const common = require('./_base')

const schema = new Schema(Object.assign({
  name: { type: String, unique: true, required: true },
  path: { type: String, unique: true, required: true },
}, common));

module.exports = mongoose.model('category', schema);
