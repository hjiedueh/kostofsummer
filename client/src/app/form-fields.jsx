import React from "react";
import Form from 'react-bootstrap/Form';
import { useField } from "formik";

export const MyTextInput = ({ label, ...props }) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and alse replace ErrorMessage entirely.
    const [field, meta] = useField(props);
    return (
      <div className="my-3">
        <Form.Label htmlFor={props.id || props.name}>{label}</Form.Label>
        <Form.Control className="text-input shipping-field" {...field} {...props} />
        {meta.touched && meta.error ? (
            <Form.Control.Feedback type='invalid' style={{display:'block'}}>
                {meta.error}
            </Form.Control.Feedback>
        ) : null}
      </div>
    );
};

export const MyTextInputWOLabel = ({ ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and alse replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  return (
    <div className="my-3" style={{width: '50%'}}>
      <Form.Control className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
          <Form.Control.Feedback type='invalid' style={{display:'block'}}>
              {meta.error}
          </Form.Control.Feedback>
      ) : null}
    </div>
  );
};

export const MyCheckbox = ({ children, ...props }) => {
    const [field, meta] = useField({ ...props, type: "checkbox" });
    return (
      <>
        <label className="checkbox">
          <input {...field} {...props} type="checkbox" />
          {children}
        </label>
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </>
    );
  };

export const MyTextArea = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div className="my-3">
            <Form.Label htmlFor={props.id || props.name}>{label}</Form.Label>
            <Form.Control as="textarea" rows="10" className="textarea" {...field}{...props} />
            {meta.touched && meta.error ? (
                <Form.Control.Feedback type='invalid' style={{display:'block'}}>
                    {meta.error}
                </Form.Control.Feedback>
            ) : null}
        </div>
    )
}

export const MyTextAreaWOLabel = ({ ...props }) => {
  const [field, meta] = useField(props);
  return (
      <div className="my-3">
          <Form.Control as="textarea" rows="10" className="textarea" {...field}{...props} />
          {meta.touched && meta.error ? (
              <Form.Control.Feedback type='invalid' style={{display:'block'}}>
                  {meta.error}
              </Form.Control.Feedback>
          ) : null}
      </div>
  )
}

export const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <br/>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const MyFileUpload = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
      <div className="my-3">
          <Form.Label htmlFor={props.id || props.name}>{label}</Form.Label>
          <Form.File className="textarea" {...field}{...props} />
          {meta.touched && meta.error ? (
              <Form.Control.Feedback type='invalid' style={{display:'block'}}>
                  {meta.error}
              </Form.Control.Feedback>
          ) : null}
      </div>
  )
}

export const alpha = /^[a-zA-Z_]+( [a-zA-Z_]+)*$/;
