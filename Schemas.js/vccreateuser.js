const { Schema, model } = require('mongoose');

let vccreate = new Schema({
    Guild: String,
    Channel: String,
    User: String
});

module.exports = model('vccreateuser123424a324', vccreate);