import React from 'react';
import Row from 'react-bootstrap/Row';

export const Footer = () => {
    // TODO: include the link to the project description page on CMUIS
    return (
        <Row id="footer">
            <p>© 2024 Treasure House Fashions</p>
            <p><a href="/">Developed and Deployed</a> by Peter Lu, Om Patel, and Ryan Wong</p>
        </Row>
    )
}