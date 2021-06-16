const express = require('express');
const bodyParser = require('body-parser');
const expressAsyncHandler = require('express-async-handler')
const Order = require('../models/order')
const cors = require('./cors');

const orderRouter = express.Router()
orderRouter.use(bodyParser.json());

orderRouter.route('/').options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Order.find(req.query)
    .then((orders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(orders)  
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, expressAsyncHandler(async( req,res) => {
    console.log(req.body)
    if (req.body.orderItems.length === 0) {
        res.status(400).send({ message: 'Cart is empty' });
    } else {
        const order = new Order({
            orderItems: req.body.orderItems,
            orderNum: req.body.orderNum,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            shippingPrice: req.body.shippingPrice,
            totalPrice: req.body.totalPrice,
            payer: req.body.payer,
            purchaseUnits: req.body.purchaseUnits
        });
        const createdOrder = await order.save();
        res.status(201).send({ message: 'New order created', order: createdOrder })
    }
}))

orderRouter.route('/:orderId').options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.orderId);
    if (order) {
        res.send(order)
    } else {
        res.status(404).send({ message: 'Order not found'})
    }
}))

module.exports = orderRouter;