import Button from "react-bootstrap/Button";
import { AgencyParams } from "../../interfaces";
import { formatPhone } from "./AgencyPage";
import React from "react";

// This file standardizes the display of an agency in the list of agencies
function Agency({ renderObject: agency, callback: onDelete } : AgencyParams){

    return (
        <tr key={agency.id}>
            <td className="cert-item">{agency.name}</td>
            <td className="cert-item">{agency.active ? "Yes" : "No"}</td>
            <td className="cert-item">{agency.phone ? formatPhone(agency.phone): "N/A"}</td>
            <td className="cert-item">{agency.email || "N/A"}</td>
            <td className="cert-item">
                <Button variant="outline-primary" href={`/agencies/${agency.id}`}>
                    View
                </Button>
            </td>
                
            <td className="cert-item">
                <Button variant="outline-primary" onClick={onDelete(agency.id)}>
                    Archive
                </Button>   
            </td>
                
            
        </tr>
    );
}

export default Agency;
