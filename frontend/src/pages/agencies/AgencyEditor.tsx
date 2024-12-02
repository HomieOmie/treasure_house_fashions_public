import { FormEvent, useState } from "react";
import TextInput from "../../components/TextInput";
import { Row, Form, Button } from "react-bootstrap";
import { AgencyEditParams, AgencyEditorParams, TextInputFields } from "../../interfaces";
import React from "react";

// This file standardizes the form for editing an agency when viewing the agency
function AgencyEditor({ agency, onEdit, onCancel }: AgencyEditorParams){

    const [name, setName] = useState(agency.name);
    const [phone, setPhone] = useState(agency.phone);
    const [email, setEmail] = useState(agency.email);
    const [addressLine1, setAddressLine1] = useState(agency.addressLine1);
    const [addressLine2, setAddressLine2] = useState(agency.addressLine2 ? agency.addressLine2 : "");
    const [city, setCity] = useState(agency.city);
    const [state, setState] = useState(agency.state);
    const [zip, setZip] = useState(agency.zip);
    const [active, setActive] = useState(agency.active);
    const fieldList : TextInputFields[] = [
        ["agency-edit-name", "Name:", name, setName, agency.name],
        ["agency-edit-phone", "Phone:", phone, setPhone, agency.phone],
        ["agency-edit-email", "Email:", email, setEmail, agency.email],
        ["agency-edit-address-1", "Address Line 1:", addressLine1, setAddressLine1, agency.addressLine1],
        ["agency-edit-address-2", "Address Line 2:", addressLine2, setAddressLine2, agency.addressLine2],
        ["agency-edit-city", "City:", city, setCity, agency.city],
        ["agency-edit-state", "State:", state, setState, agency.state],
        ["agency-edit-zip", "Zip:", zip, setZip, agency.zip]
    ]

    async function sendEditRequest(params : AgencyEditParams) {
        const token = localStorage.getItem('token');
        await fetch(`https://thf-node-server-s64bwmcpia-uk.a.run.app/agencies/${agency.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                params: params,
                jwtToken: token
            }),
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    onEdit(false, 'success', data.message);
                } else {
                    onEdit(true, 'danger', data.message);
                }
            })
            .catch((error) => {
                onEdit(true, 'danger', error.message);
            });
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        sendEditRequest({ name, phone, email, addressLine1, addressLine2, city, state, zip, active });
    }

    // TODO: use react-bootstrap to style the forms!
    return (
        <Row>
            <h2>Editing Agency</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <fieldset>
                    {
                        fieldList.map(([id, label, value, setValue]) => {
                            return <TextInput id={id} label={label} value={value} setValue={setValue} />
                        })
                    }
                    <Form.Group>
                        <Form.Check type="checkbox" id="agency-edit-active" className="mb-3"
                            label="Active" checked={active} onChange={(e) => setActive(e.target.checked)} />
                    </Form.Group>
                    </fieldset>
                </Row>
                <Row className="search-options">
                    <Button className="col-sm-3 col-md-2 col-lg-1" onClick={() => onCancel()}>Cancel</Button>
                    <Button className="col-sm-3 col-md-2 col-lg-1" type="submit">Submit</Button>
                </Row>

            </Form>
        </Row>
    );

}

export default AgencyEditor;
