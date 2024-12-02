import { FormEvent, FormEventHandler, useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Button, Row, Form } from 'react-bootstrap';
import NumberInput from '../../components/NumberInput';
import { CertificateCreatorParams, certificateAgency } from '../../interfaces';
import React from 'react';

// This file standardizes the form for creating gift certificates under the lists of gift certificates
function CertificateCreator({ onCreation, onCancel }: CertificateCreatorParams) {
    const [agency, setAgency] = useState({} as certificateAgency);
    const [amount, setAmount] = useState(30);
    const [num, setNum] = useState(0);
    const [agencies, setAgencies] = useState([] as certificateAgency[]);

    useEffect(() => {
        const fetchAgencies = async () => {
            // const token = localStorage.getItem('token')
            const response = await fetch('https://thf-node-server-s64bwmcpia-uk.a.run.app/agencies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jwtToken: localStorage.getItem('token')
                })
            })
            const responseData = await response.json();
            const data = await responseData.data
            console.log("DATA: ", data)
            setAgencies(data);
        };
        fetchAgencies();
    }, [])

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onCreation({ agencyId: agency.id, amount, num });
    }

    const filterAgencies = async (inputValue: string) => {
        return agencies.filter(a =>
            a.name.toLowerCase().includes(inputValue.toLowerCase())
        ).map(a => {
            return { id: a.id, name: a.name };
        });
    }

    // TODO: modularize helpers for asyncselect
    const getOptions = (inputValue: string) => {
        if (!inputValue) {
            return Promise.resolve([]);
        } else {
            return filterAgencies(inputValue);
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
            <h2>Create Gift Certificates</h2>
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
                    <NumberInput id="gc-create-amount" label="Amount Per Certificate: " value={amount} setValue={setAmount} />
                    <NumberInput id="gc-create-number" label="Number of Certificates: " value={num} setValue={setNum} />
                    <Row className="search-options">
                        <Button variant="secondary" className={"col-sm-4 col-md-2 col-lg-1"} onClick={() => onCancel(false)}>Cancel</Button>
                        <Button type="submit" className={"col-sm-4 col-md-2 col-lg-1"}>Create</Button>
                    </Row>
                </fieldset>
            </Form>
        </Row>

    )
}

export default CertificateCreator;
