import React, { FormEvent, useState } from "react";
import PropTypes from "prop-types";
import TextInput from "../../components/TextInput";
import { Row, Form, Button } from "react-bootstrap";
import { TextInputFields, UserEditParams, UserEditorParams } from "../../interfaces";

// This file standardizes the form for editing a gift certificate when viewing the gift certificate
function UserEditor({ user, onEdit: setIsEditing }: UserEditorParams){
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [phone, setPhone] = useState(user.phone);
    const [role, setRole] = useState(parseInt(user.role) === 0 ? "Admin" : "Staff");
    const [status, setStatus] = useState(user.status === true ? "Enabled" : "Disabled");
    const fieldList: TextInputFields[] = [
        ["user-edit-first-name", "First Name:", firstName, setFirstName, user.firstName],
        ["user-edit-last-name", "Last Name:", lastName, setLastName, user.lastName],
        ["user-edit-phone", "Phone:", phone, setPhone, user.phone],
    ]

    // TODO: Stub function for the sake of demo, remove after actual function is implemented
    async function sendEditRequest({ firstName, lastName, phone, role } : UserEditParams) {
        setIsEditing(false);

        try {
            const token = localStorage.getItem('token')
            const userRole = role === "Admin" ? 0 : 1;
            const userStatus = status === "Enabled" ? true : false;
            const response = await fetch(`https://thf-node-server-s64bwmcpia-uk.a.run.app/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName, 
                    lastName: lastName, 
                    phone: phone, 
                    role: userRole,
                    status: userStatus,
                    jwtToken: token
                })
            })
            if (response.ok) {
                alert("User Updated");
            } else {
                throw new Error(`Error updating user information`)
            }
        } catch (error: any) {
            alert(`Error updating user information`);
            console.error("Error updating user information");
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        sendEditRequest({ firstName, lastName, phone, role });
    }

    // TODO: use react-bootstrap to style the forms!
    return (
        <Row>
            <h2>Editing User Information</h2>
            <Form onSubmit={handleSubmit}>
                <fieldset>
                    {fieldList.map(([id, label, value, setValue]) => (
                        <TextInput id={id} label={label} value={value} setValue={setValue} />
                    ))}
                    <Form.Group>
                        <Form.Label>Role:</Form.Label>
                        <Form.Select value={role} onChange={(e) => setRole(e.target.value)} className="mb-3">
                            <option value="Staff">Staff</option>
                            <option value="Admin">Admin</option>
                        </Form.Select>
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                </fieldset>
            </Form>
        </Row>
    );

}

UserEditor.propTypes = {
    onEdit: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
};

export default UserEditor;
