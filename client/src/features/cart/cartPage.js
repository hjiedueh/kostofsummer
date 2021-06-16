import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import { useSelector, useDispatch } from "react-redux";
import { itemRemoved, qtyIncreased, qtyDecreased, sizeChange } from './cartSlice'
import {
    fetchItems,
    selectItemIds,
    selectItemsById
} from '../products/prodSlice'
import Hoodie from '../../img/hoodie-front.webp'




const CartItem = (item) => {
    const dispatch = useDispatch()
    const price = (item.item.price/100).toFixed(2)
    const total = (item.item.total/100).toFixed(2)

    const [size, setSize] = useState(null)

    const handleRemoveItem = async (item) => {
        try {
            dispatch(itemRemoved(item.id))
        } catch (err) {
            console.error('Failed to remove item from cart: ', err)
        }        
    }

    const handleQtyIncreased = async (item) => {
        try {
            dispatch(qtyIncreased(item))
        } catch (err) {
            console.error('Failed to change quantity: ', err)
        }
    }

    const handleQtyDecreased = async (item) => {
        try {
            dispatch(qtyDecreased(item))
        } catch (err) {
            console.error('Failed to change quantity: ', err)
        }
    }

    const handleSize = async (value, item) => {
        let i = {value, item}
        try {
            dispatch(sizeChange(i))
        } catch (err) {
            console.error('Failed to change size: ', err)
        }
    }

    return(
        <Row className="cart-row">
            <Col md={2} lg={2}>
                <Link to={`/items/${item.item.id}`}>
                    <Image src={`/items/${item.item.image}`} className="cart-img text-center"/>
                </Link>
            </Col>
            <Col md={4} lg={4} className="mt-2 cart-desc">
                <p>{item.item.name}</p>
                <div className='size-wrapper'>
                    <p>{item.item.size}</p>
                    <Accordion>
                        <Accordion.Toggle as='div' variant="link" eventKey="0">
                            <p className='edit-size'>Edit Size</p>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <div className='sizes-wrapper'>
                                <Button className='size btn' value='s' as='p' onClick={()=>{handleSize('s', item.item.id)}}>s</Button>
                                <Button className='size btn' value='m' as='p' onClick={()=>{handleSize('m', item.item.id)}}>m</Button>
                                <Button className='size btn ' value='l' as='p' onClick={()=>{handleSize('l', item.item.id)}}>l</Button>
                                <Button className='size btn ' value='xl' as='p' onClick={()=>{handleSize('xl', item.item.id)}}>xl</Button>
                                <Button className='size btn ' value='xxl' as='p' onClick={()=>{handleSize('xxl', item.item.id)}}>xxl</Button>
                            </div>
                        </Accordion.Collapse>
                    </Accordion>
                </div>
            </Col>
            <Col md={2} lg={2}>
                <p className="text-center">{price}</p>
            </Col>
            <Col md={2} lg={2} className="mt-2 text-center quantity-wrapper">
                <p onClick={()=>{handleQtyDecreased(item.item.id)}}>-</p><p className="qty">{item.item.qty}</p><p onClick={()=>{handleQtyIncreased(item.item.id)}}>+</p>
            </Col>
            <Col md={2} lg={2} className="mt-2">
                <p className="text-center">{total}</p>
            </Col>
            <Button variant="outline-danger" size="sm" onClick={()=>{handleRemoveItem(item.item)}}>remove</Button>
        </Row>
    )
}

const OtherItem = (itemId) => {
    const item = useSelector(state => selectItemsById(state, itemId))
    console.log(item)
    return (
        <Col>
            <Link to={`/items/${item.item.id}`}>
                <Image src={`/items/${item.item.image}`} className="other-img text-center"/>
            </Link>
        </Col>
    )
}

export const CartPage = () => {
    const cart = useSelector(state => state.cart)
    const items = useSelector(state => state.items)
    const history =  useHistory()
    const dispatch = useDispatch()
    

    const itemStatus = useSelector(state => state.items.status)
    const orderedItemIds = useSelector(selectItemIds)
    const error = useSelector(state => state.items.error)

    let others = orderedItemIds.filter(val => !cart.ids.includes(val))
    console.log(others)

    

    useEffect(() => {
        if (itemStatus === 'idle') {
            dispatch(fetchItems())
        }
    }, [itemStatus, dispatch])

    let itemContent

    // if (itemStatus === 'loading') {
    //     itemContent = <div className='loader'>Loading...</div>
    // } else if (itemStatus === 'succeeded') {
    //     itemContent = 
    //         <Row className='other-row'>
    //             {others.map(itemId => (
    //                 <OtherItem itemId={itemId} key={itemId} />
    //             ))}
    //         </Row>
    // } else if (itemStatus === 'error') {
    //     itemContent = <div>{error}</div>
    // }
    

    const content = cart.cart.map(item => (
        <CartItem item={item} key={item.id} />
    ))

    if(cart.cart.length === 0) {
        history.push('/')
    }

    return (
        <Container className="my-5">
            <Row className="cart-page-header">
                <Col md={2} lg={2}>
                    
                </Col>
                <Col md={4} lg={4}>

                </Col>
                <Col md={2} lg={2}>
                    <p className="text-center">Price</p>
                </Col>
                <Col md={2} lg={2}>
                    <p className="text-center">Quantity</p>
                </Col>
                <Col md={2} lg={2}>
                    <p className="text-center">Total</p>
                </Col>
            </Row>
            {content}
            <div>
                <p className="cart-row py-3 text-center">Total: {(cart.total/100).toFixed(2)}</p>
                <div className='d-grid gap-2 add-to text-center'>
                    <Accordion>
                        <Accordion.Toggle as='div' variant="link" eventKey="0">
                            <p className='add-more-link'>add more items</p>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Row className='add-more-wrapper'>
                                {/* {itemContent} */}
                            </Row>
                        </Accordion.Collapse>
                    </Accordion>
                    <Button className="btn btn-dark add-to-btn ml-2 mt-2" size="sm" onClick={() => {history.push('/shipping')}}>Checkout</Button>
                </div>
                
            </div>
        </Container>
    )
}