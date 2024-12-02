import React from "react";
import Button from "react-bootstrap/Button";
import { UserParams } from "../../interfaces";
import { Navigate } from "react-router-dom";

function User({ renderObject: user }: any){

    //TODO: Add validation to ensure that an Admin is always present in the system
    return (
        <tr key={user.id}>
            {/* <td className="cert-item">{user.username}</td> */}
            <td className="cert-item">{user.firstName}</td>
            <td className="cert-item">{user.lastName}</td>
            <td className="cert-item">{user.email}</td>
            <td className="cert-item">{user.phoneNumber}</td>
            <td className="cert-item">{user.role === 0 ? "Admin" : "Staff"}</td>
            <td className="cert-item">{user.status === true ? "Enabled" : "Disabled"}</td>
            <td className="cert-item">
                <Button href={`/users/${user.id}`}>View</Button>
            </td>
        </tr>
    );
}

export default User;
