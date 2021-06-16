import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { useSelector } from 'react-redux'

const Header = () => {
    const cart = useSelector(state => state.cart)
    // console.log(cart)
    let cartNum
    if (cart.totalQty < 10) {
        cartNum = '0'+cart.totalQty
    } else {
        cartNum = cart.totalQty
    }


    return (
        <div className="header">
            <Navbar expand="lg" bg="light" variant="light" fixed="top">
                <Container fluid>
                    <div className='nav-left'>
                        <Navbar.Toggle className="nav-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="">menu</span>
                        </Navbar.Toggle>
                    </div>
                    <div className='brand-wrapper me-auto text-center'>
                        <Navbar.Brand href="/home">Navbar</Navbar.Brand>
                    </div>
                    <div className='nav-right ms-5'>
                        {!cart ?
                            <a href="/cart" className="cart-num">00</a>
                            :
                            <a href="/cart" className="cart-num">{cartNum}</a>
                        }
                    </div>
                    <Navbar.Collapse id="navbarTogglerDemo03" className='header-nav'>
                        <Nav className="mr-auto">
                            <Nav.Link href="#features">MEN</Nav.Link>
                            <Nav.Link href="#pricing">WOMAN</Nav.Link>
                            <Nav.Link href="#pricing">CHILD</Nav.Link>
                            <Nav.Link href="#pricing">ACCESSORIES</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default Header
