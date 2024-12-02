import React, { FormEvent, FormEventHandler, useState } from 'react';
import { Button, Row, Form } from 'react-bootstrap';
import TextInput from '../../components/TextInput';
import { TextInputFields } from '../../interfaces';

// This file standardizes the form for creating gift certificates under the lists of gift certificates
function UserCreator(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Staff");
    const fieldList: TextInputFields[] = [
        ["user-create-first-name", "First Name:", firstName, setFirstName],
        ["user-create-last-name", "Last Name:", lastName, setLastName],
        ["user-create-phone", "Phone:", phone, setPhone],
        ["user-create-email", "Email:", email, setEmail]
    ]

    const handleSubmit : FormEventHandler<HTMLFormElement> = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token')
            const userRole = role === "Admin" ? 0 : 1;
            const response = await fetch('https://thf-node-server-s64bwmcpia-uk.a.run.app/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName, 
                    lastName: lastName, 
                    phone: phone, 
                    email: email, 
                    role: userRole,
                    jwtToken: token
                })
            });
            if (response.ok) {
                alert("User Succesfully Added");
            } else {
                throw new Error(`Error adding new user`);
            }
        } catch (error: any) {
            alert("Error adding new user");
            console.log("Error adding new user");
        }
    }

    return (
        <Row>
            <h2>Add a new User</h2>
            <Form onSubmit={handleSubmit}>
                <fieldset>
                    {/* TODO: Add authentication-related fields */}
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
                    <Button type="submit">Create</Button>
                </fieldset>
            </Form>
        </Row>

    )
}

export default UserCreator;
