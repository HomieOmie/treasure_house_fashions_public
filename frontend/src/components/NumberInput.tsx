// TODO: create citations for using PATS_v3 react part
// https://github.com/67272-App-Design-Dev/PATS_v3/blob/react/app/javascript/components/shared/form/NumberInput.js
import React, { ChangeEvent } from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import { NumberInputParams } from "../interfaces";

function NumberInput({ id, label, value, setValue, ...props }: NumberInputParams) {

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor={id}>{label}</Form.Label>
      <Form.Control id={id} type="number" value={value} onChange={onChange} min="0" {...props} />
    </Form.Group>
  );
}

export default NumberInput;