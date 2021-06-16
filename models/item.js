const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const Item = new Schema ({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    picture: {
        type: String,
        default: ''
    },
    units: {},
    category: {
        type: String,
        required: true
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Item', Item);