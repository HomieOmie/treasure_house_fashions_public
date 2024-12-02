import React, { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import { Container, Row } from 'react-bootstrap';
import { Navigate, useNavigate } from "react-router-dom";
import { Footer } from '../components/Footer';

export const Home = () => {

    // set the tab title
    document.title = 'Home';

        return (
            <Container>
                <TopBar />
    
                <Row>
                    <img className="mt-3 mb-3 homepage-img col-md-6 col-sm-12" src="/homepage_pic_1.jpeg" alt="" />
                    <img className="mt-3 mb-3 homepage-img col-md-6 col-sm-12" src="/homepage_pic_2.jpeg" alt="" />
                </Row>
                <Row>
                    <h2>
                        Welcome to Gift Certificate Management System!
                    </h2>
                    <p>
                        This is a simple application to manage gift certificates. It allows staff members to create, view, 
                        update, and delete gift certificates. It also allows us to generate reports on gift certificates automatically.
                        This application provides automated ways of managing gift certificates to better serve our mission of empowering
                        women with clothing, especially for those who are in transition. 
                        It echoes with our mission statement of:
                    </p>
                    <p>
                        <i>
                            Promoting the dignity and self-esteem of women, particularly women in transition or crisis.
                            Outward appearance is not an accurate reflection of your worth, but it can affirm the treasure 
                            that you truly are!
                        </i>
                    </p>
                </Row>
                <Footer />
            </Container>
        )


    
}

export default Home;
