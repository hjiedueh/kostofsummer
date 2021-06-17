import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import { useSelector, useDispatch } from "react-redux";
// import { CheckoutSteps } from "./checkoutSteps";
import { itemRemoved, addOrder, qtyIncreased, qtyDecreased } from './cartSlice'
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { generateRandomCharacters } from "../../app/randomGen";



export const CheckoutPage = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const cart = useSelector(state => state.cart)
    const toPrice = (num) => Number(num)
    const price = (cart.total/100).toFixed(2)
    const shipping = 10.00
    const ot = toPrice(price)
    const total = (ot).toFixed(2)

    const [sdkReady, setSdkReady] = useState(false)

    const handleRemoveItem = async (item) => {
        try {
            dispatch(itemRemoved(item.id))
        } catch (err) {
            console.error('Failed to remove item from cart: ', err)
        }
    }

    const handleAddOrder = async (details) => {
        const orderNum = generateRandomCharacters(5)
        console.log(orderNum)
        const order = {orderItems: cart.cart, orderNum: orderNum, shippingAddress: cart.shippingInfo, paymentMethod: cart.paymentMethod, shippingPrice: shipping, totalPrice: total, payer: details.payer, purchaseUnits: details.purchase_units}
        try {
            const resultAction = await dispatch(addOrder(order))
            console.log(resultAction)
            history.push(`/orders/${resultAction.payload.order._id}`)
            // history.block()
        } catch (err) {
            console.error('Failed to add order: ', err)
        }
    }

    useEffect(() => {
        const addPaypalScript = async () => {
            const { data } = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
            script.async = true;
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }
        if (cart.paymentMethod === 'Paypal') {
            if (!window.paypal) {
                addPaypalScript();
            } else {
                setSdkReady(true)
            }
        }
    }, [cart])

    if(!cart.paymentMethod) {
        history.push('/paymentmethod')
    }
    if(cart.cart.length === 0) {
        history.push('/')
    }
    return (
        <Container fluid className='my-5 text-center checkout-con' style={{padding: '0px'}}>
            <Row><p style={{textTransform:'uppercase'}}>Order Summary</p></Row>
            <Row>
                <Col md={12} lg={12} style={{padding: '0px'}}>
                    <div className='checkout-wrapper'>
                        {cart.cart.map(item => (
                            <Row key={item.id} className='m-2'>
                                <Col md={2} lg={2}>
                                    <Link to={`/items/${item.id}`}>
                                        <Image src={`/items/${item.image}`} className="cart-img"/>
                                    </Link>
                                </Col>
                                <Col md={4} lg={4} className="mt-2 cart-desc">
                                    <p>{item.name}</p>
                                    <p>{item.size}</p>
                                    <p>{item.qty}</p>
                                </Col>
                                <Col md={2} lg={2} className="mt-2 ">
                                    <p className="text-center">{(item.price/100).toFixed(2)}</p>
                                </Col>
                                <Col md={2} lg={2} className="mt-2">
                                    <p className="text-center">{(item.total/100).toFixed(2)}</p>
                                </Col>
                                <Button variant="outline-danger" onClick={()=>{handleRemoveItem(item)}}>Remove</Button>
                            </Row>
                        ))}
                    </div>    
                </Col>
                <Col className='order-info'>
                    <div style={{border: '0px'}}>
                        <div className='m-2'>
                            <strong>Email: </strong>{cart.shippingInfo.email} <Link to='/shipping' className='mx-2'>Change</Link>
                            <br />
                            <strong>Phone: </strong>{cart.shippingInfo.phone} <Link to='/shipping' className='mx-2'>Change</Link>  
                        </div>
                        <div className='m-2 text-center'>
                            <strong>Shipping: </strong> <br /> 
                            {cart.shippingInfo.fullname} <br />
                            {cart.shippingInfo.address} <br />
                            {cart.shippingInfo.address2} <br />  
                            {cart.shippingInfo.city}, 
                            {cart.shippingInfo.postal}, 
                            {cart.shippingInfo.country} 
                            <Link to='/shipping' className='mx-2'>Change</Link> 
                        </div>
                        <div className='m-2'>
                            <strong>Payment Method: </strong>{cart.paymentMethod} <Link to='/paymentmethod' className='mx-2'>Change</Link> 
                        </div>
                    </div>
                    <div className='mt-5' style={{border: '0px'}}>
                        <div className='m-2'>
                            <div className='order-summ mb-3'>
                                <span><strong>Subtotal: </strong></span><span className='order-page-subtotal'>${price}</span> <br />
                                <strong className='mb-5'>Order Total: </strong><span>${total}</span> <br />
                            </div>
                            {!sdkReady ? (
                                <div className='loader'>Loading...</div>
                            ) : (
                                <PayPalButton
                                    amount={total}
                                    onSuccess={(details) => {handleAddOrder(details)}}
                                    style= {{
                                        color: 'black'
                                    }}
                                ></PayPalButton>
                            )}
                                {/* <Button disabled={cart.cart.length === 0} variant="warning" onClick={()=>{handleAddOrder()}}>Submit</Button> */}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}