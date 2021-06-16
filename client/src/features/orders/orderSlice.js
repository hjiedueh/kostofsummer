import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import axios from 'axios'

const ordersAdapter = createEntityAdapter()

const initialState = ordersAdapter.getInitialState({
    status: 'idle',
    error: null,
    order: {},
    orders: localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : []
})

export const fetchOrder = createAsyncThunk('cart/fetchOrder', async (orderId) => {
    const response = await axios.get(`/api/orders/${orderId}`)
    return response.data
})

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchOrder.pending]: (state) => {
            state.status = 'loading'
        },
        [fetchOrder.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.order = action.payload
            localStorage.removeItem('cartItems')
            localStorage.removeItem('total')
        },
        [fetchOrder.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        }
    }
})

export default ordersSlice.reducer