import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../../components/TopBar";
import Alert from "react-bootstrap/Alert";
import AgencyEditor from "./AgencyEditor";
import { Button, Container, Row } from "react-bootstrap";
import { agency } from "../../interfaces";
import { Footer } from "../../components/Footer";

// This file standardizes the display of an agency when viewing the agency

export const formatPhone = (phone: string) => {
    if (phone.length > 10){
        return `(${phone.substring(0,3)}) ${phone.substring(3,6)}-${phone.substring(6,10)} x${phone.substring(10)}`;
    }
    return `(${phone.substring(0,3)}) ${phone.substring(3,6)}-${phone.substring(6,10)}`;
}

function AgencyPage() {
    const { id } = useParams();
    const [agency, setAgency] = useState<agency>({} as agency);
    const [isEditing, setIsEditing] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMsg, setAlertMsg] = useState('');


    useEffect(() => {
        const fetchAgency = async () => {
            try {
                const token = localStorage.getItem('token')
                // Perform your asynchronous data fetching here
                const response = await fetch(`https://thf-node-server-s64bwmcpia-uk.a.run.app/agencies/${id}`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jwtToken: token
                    })
                });
                if (!response.ok) {
                    setAlert(false, 'danger', 'Failed to fetch agency');
                }
                const responseData = await response.json();
                const data = responseData.data;
                
                setAgency({id: id, ...data}); // Update state with fetched data
            } catch (error: any) {
                console.error('Error fetching agency:', error);
            }
        };

        fetchAgency(); // Call the fetch function when the component mounts
    }, [alertType, alertMsg, id])
  
    const setAlert = (editing: boolean, alertType: string, alertMsg: string) => {
        setIsEditing(editing);
        setAlertType(alertType);
        setAlertMsg(alertMsg);
        setTimeout(() => {
            setAlertType('');
            setAlertMsg('');
        }, 5000);
    };

    const archiveAgency = (id: string) => {
        return async () => {
            try {
                const response = await fetch(`https://thf-node-server-s64bwmcpia-uk.a.run.app/agencies/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ archive: true, active: false })
                });
                const data = await response.json();
                if (response.ok) {
                    setAlert(false, 'success', data.message);
                } else {
                    setAlert(false, 'danger', data.message);
                }
            } catch (error: any) {
                setAlert(false, 'danger', error.message);
            }
        }
    }

    // set the tab title
    document.title = 'Agency Details for ' + agency.name;
    
    return (
        <Container>
            <TopBar />
            { alertType === 'success' && <Alert variant={alertType}>{alertMsg}</Alert>}
            <Row>
                <h2>{agency.name}</h2>
                <p>
                    Phone: {agency.phone ? formatPhone(agency.phone) : "N/A"}
                </p>
                <p>
                    Email: {agency.email || "N/A"}
                </p>
                <p>
                    Address Line 1: {agency.addressLine1}
                </p>
                <p>
                    Address Line 2: {agency.addressLine2 || "N/A"}
                </p>

                <p>
                    City: {agency.city}
                </p>
                <p>
                    State: {agency.state}
                </p>
                <p>
                    Zip: {agency.zip || "N/A"}
                </p>
                <p>
                    Active: {agency.active ? "Yes" : "No"}
                </p>
            </Row>
            {!isEditing &&
                <Row id="item-options">
                    <Button className="col-sm-4 col-md-2" onClick={() => setAlert(true, '', '')}>Edit</Button>
                    <Button className="col-sm-4 col-md-2" onClick={archiveAgency(id as string)}>Archive</Button>
                </Row>
            }

            { alertType === 'danger' && <Alert variant={alertType}>{alertMsg}</Alert>}

            {
                isEditing && <AgencyEditor agency={agency} onEdit={setAlert} onCancel={() => setIsEditing(false)} />
            }
            <Footer />
        </Container>
    );
}

export default AgencyPage;