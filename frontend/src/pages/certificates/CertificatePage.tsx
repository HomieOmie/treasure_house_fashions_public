import React from "react";
import { useState, useEffect } from "react";
import TopBar from "../../components/TopBar";
import Alert from "react-bootstrap/Alert";
import CertificateEditor from "./CertificateEditor";
import { Button, Container, Row } from "react-bootstrap";
import { certificate } from "../../interfaces";
import { useParams } from "react-router-dom";
import { createAndDownloadCertificate } from "./helper";
import { Footer } from "../../components/Footer";
        
function CertificatePage() {
        
    const { id } = useParams();
    const [certificate, setCertificate] = useState<certificate>({} as certificate);
    const [alertType, setAlertType] = useState('');
    const [alertMsg, setAlertMsg] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const token = localStorage.getItem('token')
                // Perform your asynchronous data fetching here
                const response = await fetch(`https://thf-node-server-s64bwmcpia-uk.a.run.app/gift_certificates/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ jwtToken: token })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch certificate');
                }
                const responseData = await response.json();
                const data = await responseData.data
                data.id = id;
                setCertificate(data); // Update state with fetched data
            } catch (error: any) {
                setAlert('danger', error.message);
            }
        };

        fetchCertificate(); // Call the fetch function when the component mounts
    }, [alertType, alertMsg, id])

    const setAlert = (type: string, msg: string) => {
        setAlertType(type);
        setAlertMsg(msg);
        setTimeout(() => {
            setAlertType('');
            setAlertMsg('');
        }, 5000);
    }

    function onEdit(v: boolean, alertType: string, alertMsg: string) {
        setIsEditing(v);
        setAlert(alertType, alertMsg);
    }

    // set the tab title
    document.title = 'Certificate Details for '+ certificate.agency?.name;
    
    return (
        <Container>
            <TopBar />

            { alertType === 'success' && <Alert key={alertMsg} variant={alertType}>{alertMsg}</Alert> }
            <Row>
                <h2>{`Certificate#${certificate.id}`}</h2>
                <p>
                    Agency: {certificate.agency?.name}
                </p>
                <p>
                    Amount: {`$${certificate.amount}`}
                </p>
                <p>
                    Percentage Redeemed: {`${Math.round(certificate.percentageRedeemed)}%`}
                </p>
                <p>
                    Remaining Value: {`$${Math.round(certificate.amount * (100 - certificate.percentageRedeemed) / 100)}`}
                </p>
                <p>
                    Value of Clothing Redeemed: {`$${Math.round(certificate.clothingValueRedeemed)}`}
                </p>
                <p>
                    Date Created: {certificate.dateCreated}
                </p>
                <p>
                    Date Redeemed: {certificate.dateRedeemed ? certificate.dateRedeemed : "Not Redeemed"}
                </p>
                <p>
                    Description: {certificate.description}
                </p>
            </Row>

            { alertType === 'danger' && <Alert key={alertMsg} variant={alertType}>{alertMsg}</Alert> }
            
            {!isEditing &&
                <Row id="item-options">
                    <Button className="col-sm-3 col-md-1" onClick={() => setIsEditing(true)}>Edit</Button>
                    <Button className="col-sm-6 col-md-3" onClick={() => {
                        createAndDownloadCertificate(certificate)
                        setAlert('success', 'Certificate downloaded successfully');
                    }}>
                    Download Certificate
                    </Button>
                </Row>
            }

            {
                isEditing && <CertificateEditor certificate={certificate} onEdit={onEdit} onCancel={()=> setIsEditing(false)}/>
            }
            <Footer />
        </Container>
    );
}

export default CertificatePage;