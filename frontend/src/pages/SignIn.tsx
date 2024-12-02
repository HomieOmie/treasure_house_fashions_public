import { Button, Container, Form, Row } from "react-bootstrap";
import TextInput from "../components/TextInput";
import React, { FormEvent, FormEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { Footer } from "../components/Footer";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit : FormEventHandler<HTMLFormElement> = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('https://thf-node-server-s64bwmcpia-uk.a.run.app/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            });
            if (!response.ok) {
                throw new Error('Failed to sign in');
            }
            const data = await response.json();
            localStorage.setItem('token', data.token)
            navigate('/');
        } catch(error: any) {
            console.error('Error fetching user:', error);
            alert("Invalid Login Credentials");
        }
    }


        // set the tab title
        document.title = 'Sign In';
        return (

            <Container>
                <TopBar />
                <Row>
                    <h2>Sign in to THF Gift Certificates Manager</h2>
                    <Form onSubmit={handleSubmit}>
                    <fieldset>
                        <TextInput id="login-email" label="Email: " value={email} setValue={setEmail} />
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor={`login-password`}>{"Password: "}</Form.Label>
                            <Form.Control id={`login-password`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <Button type="submit">Sign In</Button>
                    </fieldset>
                </Form>
                </Row>
                <Footer />
            </Container>
        )
    }


export default SignIn;