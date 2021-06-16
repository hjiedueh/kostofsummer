import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from '../features/products/prodSlice'
import cartReducer from '../features/cart/cartSlice'
import ordersReducer from '../features/orders/orderSlice'


export const store = configureStore({
  reducer: {
    items: itemsReducer,
    cart: cartReducer,
    orders: ordersReducer
  },
  devTools: true
});
