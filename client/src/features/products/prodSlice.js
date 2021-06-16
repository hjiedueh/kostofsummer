import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import axios from 'axios'

const itemsAdapter = createEntityAdapter({
    selectId: (item) => item._id,
    sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
})

const initialState = itemsAdapter.getInitialState({
    status: 'idle',
    error: null,
})

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
    const response = await axios.get('/api/items')
    return response.data
})


export const addItem = createAsyncThunk('items/addItem', async (item) => {
    const response = await axios.post('/api/items', item, {headers: { "Content-Type": "multipart/form-data"}})
    return response.data
})

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers:{
        itemAdded: {
            reducer(state, action) {
                state.items.push(action.payload)
            },
            prepare(name, description, units, type, picture) {
                return {
                    payload: {
                        name,
                        picture,
                        description,
                        units,
                        type
                    }
                }
            }
        },
        itemUpdated(state, action) {
            const {id, name, description, units, type, picture} = action.payload
            const existingItem = state.entities[id]
            if (existingItem) {
                existingItem.name = name
                existingItem.description = description
                existingItem.units = units
                existingItem.type = type
                existingItem.picture = picture
            }
        },
    },
    extraReducers: {
        [fetchItems.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchItems.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            // Add any fetched posts to the array
            // Use the `upsertMany` reducer as a mutating update utility
            itemsAdapter.upsertMany(state, action.payload)
        },
        [fetchItems.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        },
        [addItem.pending]: (state, action) => {
            state.status = 'loading'
        },
        // Use the `addOne` reducer for the fulfilled case
        [addItem.fulfilled]: itemsAdapter.addOne,
        [addItem.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        }
    }
})

export const { itemAdded, itemUpdated } = itemsSlice.actions

export const {
    selectAll: selectAllItems,
    selectById: selectItemsById,
    selectIds: selectItemIds,
} = itemsAdapter.getSelectors(state => state.items)

export default itemsSlice.reducer