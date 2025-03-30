const { Schema, model } = require('mongoose');

let vccreate = new Schema({
    Guild: String,
    Channel: String,
    Name: String,
    Limit: Number,
    Category: String
});

module.exports = model('vccreate123424324', vccreate);