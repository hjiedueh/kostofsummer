import React from "react";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import Button from 'react-bootstrap/Button';
import * as Yup from "yup";
import * as Fields from '../../app/form-fields'
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from "react-redux";
// import { CheckoutSteps } from "./checkoutSteps";
import { paymentMethodAdded } from './cartSlice'

export const PaymentMethod = () => {
    const history = useHistory()

    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)

    if(!cart.shippingInfo.address) {
        history.push('/shipping')
    }

    const handlePaymentMethod = async (values) => {
        try {
            dispatch(paymentMethodAdded(values.paymentMethod))
            history.push('/checkout')
        } catch (err) {
            console.error('Failed to add payment method: ', err)
            history.block()
        } finally {
            history.push('/checkout')
        }
    }
    const initialValues = {
        paymentMethod: cart.paymentMethod
    }

    const validation = Yup.object().shape({
        paymentMethod: Yup.string()
        .required('Required')
        .oneOf(['Paypal', 'Stripe'])

    })

    return (
        <div className="text-center" style={{marginTop: '20rem'}}>
            {/* <CheckoutSteps step1 step2 step3 /> */}
            <Formik
                initialValues={initialValues}
                validationSchema={validation}
                onSubmit={(values) => {handlePaymentMethod(values)}}
            >
                {({handleSubmit}) => (
                    <Form onSubmit={handleSubmit}>
                        <Fields.MySelect label='Payment Method' name='paymentMethod'>
                            <option value=''>Select One</option>
                            <option value='Paypal'>PAYPAL</option>
                            <option value='Stripe'>stripe</option>
                        </Fields.MySelect>
                        <div>
                            <Button type="submit" className="btn btn-dark add-to-btn ml-2 mt-2">continue</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}