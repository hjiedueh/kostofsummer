import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom';
import { Home } from './home'
import { ProdPage } from '../features/products/prodPage'
import { CartPage } from '../features/cart/cartPage'
import ShippingPage from '../features/cart/shippingPage'
import { OrderPage } from '../features/orders/orderPage';
import { PaymentMethod } from '../features/cart/paymentMethod'
import { CheckoutPage } from '../features/cart/checkoutPage';

const Main = () => {

    return (
        <>
            <Switch>
                <Route path='/home' component={Home} />
                <Route extact path='/items/:itemId' component={ProdPage} />
                <Route path='/cart' component={CartPage} />
                <Route path='/shipping' component={ShippingPage} />
                <Route path='/paymentmethod' component={PaymentMethod} />
                <Route path='/checkout' component={CheckoutPage}/>
                <Route path='/orders/:orderId' component={OrderPage} />
                <Route exact path='/' component={Home} />
            </Switch>
        </>
    )
}

export default withRouter(Main)