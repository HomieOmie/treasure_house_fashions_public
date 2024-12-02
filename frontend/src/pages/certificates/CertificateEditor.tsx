import React from "react";
import { FormEvent, useState } from "react";
import NumberInput from "../../components/NumberInput";
import TextInput from "../../components/TextInput";
import AsyncSelect from "react-select/async";
import { Row, Form, Button } from "react-bootstrap";
import { agency, CertificateEditParams, CertificateEditorParams, certificateAgency } from "../../interfaces";

// This file standardizes the form for editing a gift certificate when viewing the gift certificate
function CertificateEditor({ certificate, onEdit, onCancel }: CertificateEditorParams){

    const [agency, setAgency] = useState(certificate.agency);
    const [amountToRedeem, setAmountToRedeem] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [dateCreated, setDateCreated] = useState(certificate.dateCreated);
    const [dateRedeemed, setDateRedeemed] = useState(certificate.dateRedeemed ? 
        certificate.dateRedeemed 
        : new Date().toISOString().split('T')[0] // default to today's date if not redeemed
    );
    const [description, setDescription] = useState(certificate.description);

    async function sendEditRequest({ agencyId, amountToRedeem, dateRedeemed, discount, dateCreated, description } : CertificateEditParams) {
        if (discount >= 100 || discount < 0) {
            // TODO: Add a modal or alert to display this error
            console.error('Discount must be a percentage between 0 and 100');
        } else {
            const token = localStorage.getItem('token')
            await fetch(`https://thf-node-server-s64bwmcpia-uk.a.run.app/gift_certificates/${certificate.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agencyId,
                    amountToRedeem, 
                    dateCreated,
                    dateRedeemed,
                    discount,
                    description,
                    jwtToken: token
                })
                }).then(async (response) => {
                    const r = await response.json();
                    if (response.ok) {
                        onEdit(false, 'success', r.message);
                    } else {
                        onEdit(true, 'danger', r.message);
                    }
                }).catch((error) => {
                    console.error('Error: ', error);
                }
            )
        }
        
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        sendEditRequest({ agencyId: agency.id, amountToRedeem, dateRedeemed, discount, dateCreated: certificate.dateCreated, description });
    }

    const filterAgencies = async (inputValue: string) => {
        const data = await fetch('https://thf-node-server-s64bwmcpia-uk.a.run.app/agencies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jwtToken: localStorage.getItem('token')
            })
        })
            .then(response => response.json())
            .then(json => json.data) as agency[];
        const match = data.filter(a =>
            a.name.toLowerCase().includes(inputValue.toLowerCase())
        ).map(a => {
            return {id: a.id, name: a.name}; // label, value?
        });
        console.log(match);
        return match;
    }

    const getOptions = (inputValue: string) => {
        if (!inputValue) {
            return Promise.resolve([]);
        } else {
            return Promise.resolve(filterAgencies(inputValue));
        }
    }

    const getOptionValue = (option: certificateAgency) => {
        return option.id;
    }

    const getOptionLabel = (option: certificateAgency) => {
        return option.name;
    }
    
    return (
        <Row>
            <h2>Editing Gift Certificate</h2>
            <Form onSubmit={handleSubmit}>
                <fieldset>
                    <Form.Group className="mb-3">
                        <Form.Label>Agency: </Form.Label>
                        <AsyncSelect
                            onChange={(option) => setAgency(option as certificateAgency)}
                            id="gc-edit-agency" 
                            value={agency} 
                            cacheOptions 
                            defaultOptions
                            getOptionValue={getOptionValue}
                            getOptionLabel={getOptionLabel}
                            loadOptions={getOptions} 
                        />
                    </Form.Group>
                    <NumberInput id="gc-edit-amount" 
                        label="Amount to Be Redeemed: " 
                        value={amountToRedeem} 
                        setValue={setAmountToRedeem} />
                    <NumberInput id="gc-edit-discount" 
                        label="Percentage of Discount: " 
                        value={discount} 
                        setValue={setDiscount} />
                    <TextInput id="gc-edit-creation-date" 
                        label="Date Created: (Format: YYYY-MM-DD)" 
                        value={dateCreated} 
                        setValue={setDateCreated} />
                    <TextInput 
                        id="gc-edit-redeemed-date" 
                        label="Date Redeemed: (Format: YYYY-MM-DD, leave blank if not redeeming certificate)" 
                        value={dateRedeemed} 
                        setValue={setDateRedeemed} />
                    <TextInput id="gc-edit-description"
                        label="Description: "
                        value={description}
                        setValue={setDescription}
                    ></TextInput>
                    <Row className="search-options">
                        <Button className="col-sm-3 col-md-2 col-lg-1" onClick={() => onCancel()}>Cancel</Button>
                        <Button className="col-sm-3 col-md-2 col-lg-1" type="submit">Submit</Button>
                    </Row>
                </fieldset>
            </Form>
        </Row>
    );

}

export default CertificateEditor;
