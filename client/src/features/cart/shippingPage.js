import React from "react";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import Button from 'react-bootstrap/Button';
import * as Yup from "yup";
import * as Fields from '../../app/form-fields'
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from "react-redux";
import { shippingAddressAdded } from './cartSlice'

const validation = Yup.object().shape({
    full_name: Yup.string()
    .required('Required'),
    address: Yup.string()
    .required('Required'),
    city: Yup.string()
    .required('Required'),
    postal: Yup.number()
    .required('Required')
    .positive()
    .integer()
    .min(5),
    country: Yup.string()
    .required('Required'),
    email: Yup.string()
    .required()
    .email(),
    phone: Yup.string()
    .required()
    .min(10)
    .max(10)
})

const ShippingPage = () => {
    const history = useHistory()

    const dispatch = useDispatch()
    const shippingAddress = useSelector(state => state.cart.shippingInfo)

    const initialValues = {
        full_name: shippingAddress.fullname,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postal: shippingAddress.postal,
        country: shippingAddress.country,
        email: shippingAddress.email,
        phone: shippingAddress.phone
    }

    const handleShipping = async (values) => {
        const address = {fullname: values.full_name, address: values.address, city: values.city, postal: values.postal, country: values.country, email: values.email, phone: values.phone}
        try {
            dispatch(shippingAddressAdded(address))
        } catch (err) {
            console.error('Failed to add shipping info: ', err)
            history.block()
        } finally {
            history.push('/paymentmethod')
        }
    }

    return (
        <div className="m-5 text-center">
            <Formik
                initialValues= {initialValues}
                validationSchema={validation}
                onSubmit={(values) => {handleShipping(values)}}
            >
                {({handleSubmit}) => (
                    <Form onSubmit={handleSubmit}>
                        <Fields.MyTextInput 
                            label="Full Name"
                            name="full_name"
                            type="text"
                        />
                        <Fields.MyTextInput
                            label="Address"
                            name="address"
                            type="text"
                        />
                        <Fields.MyTextInput
                            label="City"
                            name="city"
                            type="text"
                        />
                        <Fields.MyTextInput
                            label="Postal"
                            name="postal"
                            type="text"
                        />
                        <Fields.MyTextInput
                            label="Country"
                            name="country"
                            type="text"
                        />
                        <Fields.MyTextInput
                            label="Email"
                            name="email"
                            type="text"
                        />
                        <Fields.MyTextInput
                            label="Phone"
                            name="phone"
                            type="text"
                        />
                        <div>
                            <Button className='btn btn-dark add-to-btn ml-2 mt-2' type="submit">Submit</Button>
                        </div>
                    </Form>
                )}
                
            </Formik>
        </div>
    )
}

export default ShippingPage