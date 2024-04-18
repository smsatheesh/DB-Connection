const { Schema, model } = require( "mongoose" );

const MySchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: false
    },
    model: {
        type: String,
        required: false
    }
});

module.exports = model( "product_details", MySchema );
