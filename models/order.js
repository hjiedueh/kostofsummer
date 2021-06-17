const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const Order = new Schema ({
    orderItems: [
        {
            name: {type: String, required: true},
            size: {type: String, required: true},
            qty: {type: Number, required: true},
            image: {type: String, required: true},
            price: {type: Currency, required: true},
            total: {type: Currency, required: true},
        },
    ],
    orderNum: {type: String, required: true},
    shippingAddress: {
        fullname: {type: String, required: true},
        address: {type: String, required: true},
        address2: {type: String, required: true},
        city: {type: String, required: true},
        postal: { type: String, required: true},
        country: {type: String, required: true},
        email: {type: String, required: true}
    },
    paymentMethod: {type: String, required: true},
    shippingPrice: {type: Currency, required: true},
    totalPrice: {type: Currency, required: true},
    isDelivered: {type: Boolean, default: false},
    deliveredAt: {type: Date},
    payer: {},
    purchaseUnits: []

},
{
    timestamps: true
})

module.exports = mongoose.model('Order', Order);