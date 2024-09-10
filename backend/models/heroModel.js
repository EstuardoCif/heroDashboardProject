const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heroSchema = new Schema({
    hero_id: Number,
    name: String,
    eye_color: String,
    hair_color: String,
    skin_color: String,
    height: Number,
    weight: Number,
    race: String,
    publisher_id: Number,
    gender_id: Number,
    alignment_id: Number
}, { collection: 'hero_information' });

module.exports = mongoose.model('Hero', heroSchema);