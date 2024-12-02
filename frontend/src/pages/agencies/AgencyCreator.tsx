import { FormEvent, FormEventHandler, useState } from 'react';
import { Button, Row, Form } from 'react-bootstrap';
import { AgencyCreatorParams, TextInputFields } from '../../interfaces';
import TextInput from '../../components/TextInput';
import React from 'react';

// This file standardizes the form for creating a new agency under the lists of agencies
function AgencyCreator({ onCreation, nameList, onClose }: AgencyCreatorParams){
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const fieldList : TextInputFields[] = [
        ["agency-create-name", "Name:", name, setName],
        ["agency-create-phone", "Phone:", phone, setPhone],
        ["agency-create-email", "Email:", email, setEmail],
        ["agency-create-address-1", "Address Line 1:", addressLine1, setAddressLine1],
        ["agency-create-address-2", "Address Line 2:", addressLine2, setAddressLine2],
        ["agency-create-city", "City:", city, setCity],
        ["agency-create-state", "State:", state, setState],
        ["agency-create-zip", "Zip:", zip, setZip]
    ]

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Note: the validation for unique name is done in the front end as checking on
        // the backend would require an additional request to the database. This is aceeptable
        // as there will not be a large number of concurrent users
        if (nameList.includes(name)) {
            onCreation(true, "danger", "Agency name must be unique.");
            return;
        }
        // Comment the following line in and comment the try...catch statement out to use the locally seeded data
        // The try...catch data will make an actual request to the backend and sequentially the database
        // onCreation({ name, phone, email, addressLine1, addressLine2, city, state, zip, active: true }); 
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('https://thf-node-server-s64bwmcpia-uk.a.run.app/newAgency', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name, 
                    phone: phone, 
                    email: email, 
                    addressLine1: addressLine1, 
                    addressLine2: addressLine2, 
                    city: city, 
                    state: state, 
                    zip: zip,
                    jwtToken: token
                })
            });
            const data = await response.json();
            if (response.ok) {
                onCreation(false, "success", data.message);
            } else {
                onCreation(true, "danger", data.message);
            }
        } catch (error: any) {
            onCreation(true, "danger", error.message)
        }
    };

    return (
        <Row>
            <h2>Create an Agency:</h2>
            <Form onSubmit={handleSubmit}>
                <fieldset>
                    {/* TODO: Change create agency to an async select that 
                        allows for searching agencies by name fragments */}
                    {fieldList.map(([id, label, value, setValue]) => (
                        <TextInput key={id} id={id} label={label} value={value} setValue={setValue} />
                    ))}
                    <Row id="item-options">
                        <Button className="col-sm-2 col-md-1" onClick={() => onClose(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="col-sm-2 col-md-1">Create</Button>
                    </Row>
                </fieldset>
            </Form>
        </Row>

    )
}

export default AgencyCreator;
