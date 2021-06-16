import React from 'react'
import { Video } from './video'
import { ProdList } from '../features/products/productList'
import Container from 'react-bootstrap/Container'

export const Home = () => {
    return (
        <Container fluid className='content-wrapper'>
            <Video />
            <ProdList />
        </Container>
    )
}