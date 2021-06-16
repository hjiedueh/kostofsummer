import React, { useEffect } from "react";
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useSelector, useDispatch } from "react-redux";
import { fetchOrder } from './orderSlice'

export const OrderPage = ({ match }) => {
    const dispatch = useDispatch()
    const order = useSelector(state => state.orders)
    const orderId = match.params.orderId

    useEffect(() => {
        if (order.status === 'idle') {
            dispatch(fetchOrder(orderId))
        }
        
    }, [order, dispatch, orderId])

    let content

    if (order.status === 'loading') {
        content = <div className='loader'>Loading...</div>
    } else if (order.status === 'succeeded') {
        content =
        <Container fluid className='my-5 text-center'>
            <Row className="mx-5  order-num-sm"><strong>Order Number: {order.order.orderNum}</strong></Row>
            <Row>
                <Col md={12} style={{padding: '0px'}}>

                        <Row className="cart-page-header">
                            <Col md={2} lg={2}>
                            </Col>
                            <Col md={4} lg={4} className="mt-2">
                                <p className="text-center">Item</p>
                            </Col>
                            <Col md={2} lg={2} className="mt-2">
                                <p className="text-center">Price</p>
                            </Col>
                            <Col md={2} lg={2} className="mt-2">
                                <p className="text-center">Quantity</p>
                            </Col>
                            <Col md={2} lg={2} className="mt-2">
                                <p className="text-center">Total</p>
                            </Col>
                        </Row>
                        {order.order.orderItems.map(item => (
                            <Row key={item._id}>
                                <Col md={2} lg={2}>
                                    <Link to={`/items/${item._id}`}>
                                        <Image src={`/items/${item.image}`} className="cart-img"/>
                                    </Link>
                                </Col>
                                <Col md={4} lg={4} className="mt-2 cart-desc">
                                    <p>{item.name}</p>
                                    <p>{item.size}</p>
                                </Col>
                                <Col md={2} lg={2} className="mt-2">
                                    <p className="text-center">{(item.price/100).toFixed(2)}</p>
                                </Col>
                                <Col md={2} lg={2} className="mt-2">
                                    <p className="text-center">{item.qty}</p>
                                </Col>
                                <Col md={2} lg={2} className="mt-2">
                                    <p className="text-center">{(item.total/100).toFixed(2)}</p>
                                </Col>
                            </Row>
                        ))}
                    <div className="text-center">
                        <Button variant="outline-secondary" className="my-3"><Link to="/">Back To Shop</Link></Button>
                    </div>
                </Col>
                <Col className='order-info'>
                        <div className='m-2'>
                            <strong>Email: </strong>{order.order.shippingAddress.email} <br />
                            <strong>Phone: </strong> {order.order.shippingAddress.phone}
                        </div>
                        <div className='m-2'>
                            <strong>Shipping: </strong> {order.order.shippingAddress.fullname} <br />
                            {order.order.shippingAddress.address}, {order.order.shippingAddress.city}, {order.order.shippingAddress.postal}, {order.order.shippingAddress.country}
                        </div>
                        <div className='m-2'>
                            <strong>Billing: </strong> {order.order.payer.name.given_name} {order.order.payer.name.surname} <br />
                            {order.order.payer.address.address_line_1}, {order.order.payer.address.admin_area_2}, {order.order.payer.address.admin_area_1}, {order.order.payer.address.postal_code}, {order.order.payer.address.country_code}<br /> {order.order.payer.email_address}<br /><strong>Phone: </strong> {order.order.payer.phone.phone_number.national_number}
                        </div>
                        <div className='m-2'><strong>Tracking: </strong></div>
                        <div className='m-2'>
                            <strong>Payment Method: </strong>{order.order.paymentMethod}
                        </div>
                        <div className='m-2'>
                            <strong>Order Total: </strong><span>${(order.order.totalPrice/100).toFixed(2)}</span> <br />
                        </div>
                </Col>
            </Row>
        </Container>
    } else if (order.status === 'failed') {
        content = <div className='error'>Error: {order.error}</div>
    }

    return (
        <div>
            {content}
        </div>
    )
}