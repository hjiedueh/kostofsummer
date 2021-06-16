import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { selectItemsById, fetchItems } from './prodSlice'
import { itemAdded } from '../cart/cartSlice'
import { Link } from 'react-router-dom'
import Image from 'react-bootstrap/Image'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import {Video} from '../../comps/video'
import Accordion from 'react-bootstrap/Accordion'

const Product = (item) => {
    return (
        <div className="product-image-wrapper">
            <Image src={item.item.picture} alt='poduct image' className="product-image" />
        </div>
    )
}

// const ProdThumbs = () => {
//     return (
//         <ul className='prod-thumbs'>
//             <li className="prod-thumb">
//                 <Image src={model} className="thumb-img" />
//             </li>
//             <li className="prod-thumb">
//                 <Image src={model} className="thumb-img" />
//             </li>
//             <li className="prod-thumb">
//                 <Image src={model} className="thumb-img" />
//             </li>
//             <li className="prod-thumb">
//                 <Image src={model} className="thumb-img" />
//             </li>
//         </ul>
//     )
// }

// const Composition = (itemDescription) => {
//     const [show, setShow] = useState(false)
//     const handleClose = () => setShow(false);

//     return (
//         <Modal show={show} onHide={handleClose}>
//             <Modal.Header closeButton>
//             </Modal.Header>
//             <Modal.Body>{itemDescription}</Modal.Body>
//         </Modal>
//     )
// }

const ProdDetails = (item) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [qty, setQty] = useState(1)

    const [size, setSize] = useState(null)

    const price = (item.item.price/100).toFixed(2)

    const handleQtyIncreased = () => {
        setQty(qty + 1)
    }

    const handleQtyDecreased = () => {
        if (qty === 0) {
            return null
        } else if (qty > 0) {
            setQty(qty - 1)
        }
    }

    const handleSize = (value) => {
        setSize(value)
    }

    const handleAddToCart = async (qty, size) => {
        let total = item.item.price * qty
        const piece = {id: item.item._id, name: item.item.name, size: size, price: item.item.price, qty: qty, image: item.item.picture, total: total}
        try {
            dispatch(itemAdded(piece))
            // const resultAction = await dispatch()
            // console.log(resultAction)
            // unwrapResult(resultAction)
        } catch (err) {
            console.error('Failed to add item to cart: ', err)
            history.block()
        } finally {
            history.push('/cart')
            // history.block()
        }
    }

    // const handleDesc = (itemDesc) => {

    // }
    return (
        <div className='prod-info text-center'>
            <div className='info-col'>
                <div className='title-wrapper'>
                    <p className='prod-title'>
                        {item.item.name}
                    </p>
                </div>
                <div className='price-wrapper'>
                    <p className='prod-price'>
                        {price}
                    </p>
                </div>
                <div className="size-wrappers">
                    {/* <select className="size-select" aria-label="SELECT A SIZE">
                        <option selected>SIZE</option>
                        <option value="s">S</option>
                        <option value="m">M</option>
                        <option value="l">L</option>
                        <option value="xl">XL</option>
                        <option value="xxl">XXL</option>
                    </select> */}
                    <div className='sizes-wrapper mt-3'>
                        <Button className='size btn' value='s' as='p' onClick={()=>{handleSize('s')}}>s</Button>
                        <Button className='size btn' value='m' as='p' onClick={()=>{handleSize('m')}}>m</Button>
                        <Button className='size btn ' value='l' as='p' onClick={()=>{handleSize('l')}}>l</Button>
                        <Button className='size btn ' value='xl' as='p' onClick={()=>{handleSize('xl')}}>xl</Button>
                        <Button className='size btn ' value='xxl' as='p' onClick={()=>{handleSize('xxl')}}>xxl</Button>
                    </div>
                    <div className='quantity-wrapper mt-1'>
                        <p className='qty-dec' onClick={()=>{handleQtyDecreased(item.item.id)}}>-</p>
                        <p className='qty ms-2 me-2'>{qty}</p>
                        <p className='qty-inc' onClick={()=>{handleQtyIncreased(item.item.id)}}>+</p>
                    </div>
                </div>
                
            </div>
            <div className="info-col info-col-2">
                <div className="bag-wrapper">
                    <div className="d-grid gap-2 add-to">
                        <Button className="btn btn-dark add-to-btn" type="button" onClick={()=>{handleAddToCart(qty, size)}}>add to bag</Button>
                    </div>
                </div>
                <div className="size-guide-wrapper mt-3 mb-3">
                    <Accordion>
                        <Accordion.Toggle as='div' variant="link" eventKey="0" className='comp-text-link'>
                            <p>Composition</p>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <div>
                                <p className='comp-text'>{item.item.description}</p>
                            </div>
                            
                        </Accordion.Collapse>
                    </Accordion>
                </div>
            </div>
        </div>
    )
}

export const ProdPage = ({ match }) => {
    const dispatch = useDispatch()
    const itemStatus = useSelector(state => state.items.status)
    const error = useSelector(state => state.items.error)
    const { itemId } = match.params

    useEffect(() => {
        if (itemStatus === 'idle') {
            dispatch(fetchItems())
        }
    }, [itemStatus, dispatch])

    const item = useSelector(state => selectItemsById(state, itemId))

    let content

    if (itemStatus === 'loading') {
        content = <div className='loader'>Loading...</div>
    } else if (itemStatus === 'succeeded') {
        content = <>
            <div className='prod'>
                <Video />
                <Product item={item} />
            </div>
            <ProdDetails item={item} />
        </>
    } else if (itemStatus === 'error') {
        content = <div>{error}</div>
    }

    return (
        <Container fluid className='content-wrapper'>
            {content}
        </Container>
    )
}