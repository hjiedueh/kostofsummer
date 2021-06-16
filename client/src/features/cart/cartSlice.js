import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import axios from 'axios'

const cartAdapter = createEntityAdapter()

const initialState = cartAdapter.getInitialState({
    status: 'idle',
    error: null,
    cart: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    total: localStorage.getItem('total') ? JSON.parse(localStorage.getItem('total')) : 0,
    totalQty: localStorage.getItem('totalQty') ? JSON.parse(localStorage.getItem('totalQty')) : 0,
    shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {},
    paymentMethod: localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')) : '',
    orderIds: localStorage.getItem('orderIds') ? JSON.parse(localStorage.getItem('orderIds')) : [],
})

export const addOrder = createAsyncThunk('cart/addOrder', async (order, state) => {
    const response = await axios.post('api/orders', order)
    return response.data
})



const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        itemAdded(state, action) {
            let existed_item = state.cart.find(item=> action.payload.id === item.id)
            if (existed_item) {
                if (existed_item.size === action.payload.size) {
                    existed_item.quantity = existed_item.quantity + action.payload.quantity
                    existed_item.total = existed_item.total + action.payload.total
                    state.total = state.total + action.payload.total
                    state.totalQty = state.totalQty + action.payload.qty
                    localStorage.setItem('cartItems', JSON.stringify(state.cart))
                    localStorage.setItem('total', JSON.stringify(state.total))
                    localStorage.setItem('totalQty', JSON.stringify(state.totalQty))
                } else {
                    action.payload.id = action.payload.id + '-' + action.payload.size
                    state.cart.push(action.payload)
                    state.total = state.total + action.payload.total
                    state.totalQty = state.totalQty + action.payload.qty
                    localStorage.setItem('cartItems', JSON.stringify(state.cart))
                    localStorage.setItem('total', JSON.stringify(state.total))
                    localStorage.setItem('totalQty', JSON.stringify(state.totalQty))
                }
                
            } else {
                state.cart.push(action.payload)
                // console.log(action.payload)
                state.total = state.total + action.payload.total
                state.totalQty = state.totalQty + action.payload.qty
                localStorage.setItem('cartItems', JSON.stringify(state.cart))
                localStorage.setItem('total', JSON.stringify(state.total))
                localStorage.setItem('totalQty', JSON.stringify(state.totalQty))
                cartAdapter.upsertOne(state, action.payload)
            }
        },
        itemRemoved(state, id) {
            const found = state.cart.find(item => id.payload === item.id)
            const index = state.cart.indexOf(found)
            state.cart.splice(index, 1)
            state.total = state.total - found.total
            state.totalQty = state.totalQty - found.qty
            localStorage.setItem('cartItems', JSON.stringify(state.cart))
            localStorage.setItem('total', JSON.stringify(state.total))
            localStorage.setItem('totalQty', JSON.stringify(state.totalQty))
        },
        shippingAddressAdded(state, action) {
            state.shippingInfo = action.payload
            localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo))
        },
        paymentMethodAdded(state, action) {
            state.paymentMethod = action.payload
            localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod))
        },
        qtyIncreased(state, action) {
            const found = state.cart.find(item => action.payload === item.id)
            found.qty += 1
            state.totalQty += 1
            found.total += found.price
            state.total += found.price
            localStorage.setItem('cartItems', JSON.stringify(state.cart))
            localStorage.setItem('total', JSON.stringify(state.total))
            localStorage.setItem('totalQty', JSON.stringify(state.totalQty))
        },
        qtyDecreased(state, action) {
            const found = state.cart.find(item => action.payload === item.id)
            const index = state.cart.indexOf(found)
            found.qty -= 1
            state.totalQty -= 1
            if (found.qty <= 0) {
                state.cart.splice(index, 1)
                
                // localStorage.setItem('cartItems', JSON.stringify(state.cart))
                // localStorage.setItem('total', JSON.stringify(state.total))
            }
            found.total -= found.price
            state.total -= found.price
            localStorage.setItem('cartItems', JSON.stringify(state.cart))
            localStorage.setItem('total', JSON.stringify(state.total))
            localStorage.setItem('totalQty', JSON.stringify(state.totalQty))
        },
        sizeChange(state, action) {
            console.log(action.payload)
            const found = state.cart.find(item => action.payload.item === item.id)
            found.size = action.payload.value
            localStorage.setItem('cartItems', JSON.stringify(state.cart))
        }  
    },
    extraReducers: {
        [addOrder.pending]: (state) => {
            state.status = 'loading'
        },
        [addOrder.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.orderIds.push(action.payload.order._id)
            console.log(state.orderIds)
            localStorage.setItem('orderIds', JSON.stringify(state.orderIds))
            localStorage.removeItem('totalQty')
            // state.cart = localStorage.removeItem('cartItems')
            // state.total = localStorage.removeItem('total')
        },
        [addOrder.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        }
    }
})

export const { itemAdded, itemRemoved, shippingAddressAdded, paymentMethodAdded, qtyIncreased, qtyDecreased, sizeChange } = cartSlice.actions

export default cartSlice.reducer