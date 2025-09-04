const { raw } = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,   
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User' //reference to the User model
    }
});
module.exports = mongoose.model('Review', reviewSchema); //create a model named review from the schema, Mongoose automatically makes the name plural and lowercase