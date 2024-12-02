import React from 'react';
import { NavBar } from './NavBar';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    //TODO: This should be modularized
    function handleSignOut() {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    }

    return (
            <Row id="top-bar">
                <Row>
                    <img className="col-sm-12 col-md-4 col-lg-2" src="/logo.png" alt="" />
                    <Col md="auto" sm={12}>
                        <h1>Gift Certificate Management System</h1>
                    </Col>
                    <Col md="auto">
                        <NavBar/>
                    </Col>
                </Row>
                {token &&
                    <Row>
                        <Col>
                            <Button variant="outline-primary" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        </Col>
                    </Row>
                }
            </Row>
    )
    /* 
    Format of breadCrumbs: 
    [
        <Link to="/certificates">Certificates</Link>,
        certificate.name,
    ] 
    */
};

// TopBar.propTypes = {
//     crumbs: PropTypes.array.isRequired,
//     user: PropTypes.object.isRequired,
// };

export default TopBar;