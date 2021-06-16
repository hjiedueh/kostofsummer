import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    fetchItems,
    selectItemIds,
    selectItemsById
} from './prodSlice'
import { Link } from 'react-router-dom'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'

let ItemExcerpt = ({ itemId }) => {
    const item = useSelector(state => selectItemsById(state, itemId))
    return (
        <article className="recent col-6">
            <Link to={`/items/${item._id}`}>
                <Image src={`/items/${item.picture}`} className="recent-img" />
            </Link>
        </article>
    )
}

export const ProdList = () => {
    const dispatch = useDispatch()
    const orderedItemIds = useSelector(selectItemIds)

    const itemStatus = useSelector(state => state.items.status)
    const error = useSelector(state => state.items.error)

    useEffect(() => {
        if (itemStatus === 'idle') {
            dispatch(fetchItems())
        }
    }, [itemStatus, dispatch])

    let content

    if (itemStatus === 'loading') {
        content = <div className='loader'>Loading...</div>
    } else if (itemStatus === 'succeeded') {
        content = 
            <Row className='recent-wrapper'>
                {orderedItemIds.map(itemId => (
                    <ItemExcerpt itemId={itemId} key={itemId} />
                ))} 
            </Row>
    } else if (itemStatus === 'error') {
        content = <div>{error}</div>
    }

    return (
        <div className='most-recent'>
            {content}
        </div>
        
    )
}