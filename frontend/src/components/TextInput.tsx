import React, { ChangeEvent } from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import { TextInputParams } from "../interfaces";
// This file standardizes text input fields for the forms in the application
function TextInput({ id, label, value, setValue, ...props }: TextInputParams) {

    function onChange(event: ChangeEvent<HTMLInputElement>) {
      setValue(event.target.value);
    }

    return (
    <Form.Group className="mb-3">
        <Form.Label htmlFor={id}>{label}</Form.Label>
        <Form.Control id={id} type="text" value={value} onChange={onChange} {...props} />
    </Form.Group>
    );
}
  
TextInput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    setValue: PropTypes.func.isRequired,
};
  
export default TextInput;