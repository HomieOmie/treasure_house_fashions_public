import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import TopBar from "../../components/TopBar";
import UserEditor from "./UserEditor";
import { Button, Container, Row } from "react-bootstrap";
import { user } from "../../interfaces";
import UserCreator from "./UserCreator";
import { Navigate, useParams } from "react-router-dom";
import { Footer } from "../../components/Footer";
//TODO: Ensure this works with the removal of onCreation from UswrCreator.tsx
function UserPage() {
    // TODO: Implement the proper code for fetching user when backend is connected
    const { id } = useParams();
    
    const [user, setUser] = useState<user>({} as user)

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token')
            const response = await fetch(`https://thf-node-server-s64bwmcpia-uk.a.run.app/users/${id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jwtToken: token,
                    })
                }
            )
            const data = await response.json();
            setUser(data.user);
        }

        fetchUser();
    }, [id])

    const [isEditing, setIsEditing] = useState(false);

    const onChangePermission = async (user: user) => {
        try {
            const token = localStorage.getItem('token')
            const userRole = user.role === "Admin" ? 0 : 1;
            const userStatus = user.status === true ? false : true;
            const response = await fetch(`https://thf-node-server-s64bwmcpia-uk.a.run.app/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: user.firstName, 
                    lastName: user.lastName, 
                    phone: user.phone, 
                    role: userRole,
                    status: userStatus,
                    jwtToken: token
                })
            })
            if (response.ok) {
                alert("User Status Succesfully Changed");
            } else {
                throw new Error(`Error updating user information`)
            }
        } catch (error: any) {
            alert(`Error updating user information`);
            console.error("Error updating user information");
        }
    }

    // set the tab title
    document.title = 'User Details for ' + user.firstName || '';

    //TODO: Creator component should only be accessible for Admins
    // TODO: add bootstrap-based responsive column and row layout
    return (
        <Container>
            <TopBar />
            <Row>
                {/* TODO: Add a Profile Picture and button to upload profile picture */}
                <h2>{user.firstName}</h2>
                <p>
                    Proper Name: {`${user.firstName} ${user.lastName}`}
                </p>
                <p>
                    Phone: {user.phone}
                </p>
                <p>
                    Email: {user.email}
                </p>
                <p>
                    Role: {parseInt(user.role, 10) === 0 ? "Admin" : "Staff"}
                </p>
                <p>
                    Status: {user.status === true ? "Enabled" : "Disabled"}
                </p>
            </Row>
            
            <Row id="item-options">
                    {isEditing ? (
                        <Button className="col-sm-2 col-md-1" onClick={() => setIsEditing(false)}>Cancel</Button>
                    ) : (
                        <Button className="col-sm-2 col-md-1" onClick={() => setIsEditing(true)}>Edit</Button>
                    )}
                    {/* TODO: only show the change password button if the user viewing is the user logged in */}
                    {/* <Button className="col-sm-4 col-md-2">Change Password</Button> */}
                    <Button onClick={() => onChangePermission(user)} className="col-sm-2 col-md-2" >Enable / Disable</Button>
            </Row>
            {
                isEditing && <UserEditor user={user} onEdit={setIsEditing} />
            }
            <Footer />
        </Container>
    );
}

export default UserPage;