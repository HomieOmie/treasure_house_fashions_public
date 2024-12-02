import React from "react";
import Button from "react-bootstrap/Button";
import { certificate } from "../../interfaces";
import { createAndDownloadCertificate } from "./helper";

function Certificate(cert: certificate){
    return (
        <tr key={cert.id}>
            <td className="cert-item">{cert.agency.name}</td>
            <td className="cert-item">{`$${cert.amount}`}</td>
            <td className="cert-item">{`${Math.round(cert.percentageRedeemed)}%`}</td>
            <td className="cert-item">{`$${Math.round(cert.clothingValueRedeemed)}`}</td>
            <td className="cert-item">{cert.dateCreated}</td>
            <td className="cert-item">{cert.dateRedeemed ? cert.dateRedeemed : "Not Redeemed"}</td>
            <td className="cert-item">
                <Button variant="outline-primary" href={`/certificates/${cert.id}`}>
                    View
                </Button>   
                
            </td>
            <td className="cert-item">
                <Button onClick={() => createAndDownloadCertificate(cert)}>Print</Button>
            </td>
        </tr>
    );
}

export default Certificate;
