import React from 'react';
import TopBar from '../components/TopBar';
import { Container, Row } from 'react-bootstrap';

import { Footer } from '../components/Footer';

export const UnAuthorizedPage = () => {

    function handleSignInRedirect() {
        
    }

    function handleHomeRedirect() {

    }

    // set the tab title
    document.title = 'Home';

    return (
        <Container>
            <TopBar />
            <Row>
                <h3>
                    You are not autorized to access this page. Please navigate to 
                    the <a href={'/signin'}>Sign In</a> screen or back to the <a href={'/'}>Home</a> screen.
                </h3>
            </Row>
            <Footer />
        </Container>
    )
}
