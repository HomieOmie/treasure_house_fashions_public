// This file is used to create a custom select input component that allows for asynchronous data fetching
import React from 'react';
import CheckboxSelect from 'react-select';
import { Form } from "react-bootstrap";
import { CheckboxSelectInputParams } from "../interfaces";

/** 
 * used react-select as atlaskit has become incompatible with react
 */
export default function CheckboxSelectInput(props: CheckboxSelectInputParams) {

    return (
        <Form.Group>
            <Form.Label htmlFor={`checkbox-select-${props.id}`}>{props.label}</Form.Label>
            <CheckboxSelect
                inputId={`checkbox-select-${props.id}`}
                className="checkbox-select mb-3"
                classNamePrefix="select"
                options={props.options}
                placeholder={props.placeholder ? props.placeholder : "Select..."}
            />
        </Form.Group>
    );
}