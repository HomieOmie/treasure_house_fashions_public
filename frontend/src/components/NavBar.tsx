import { ReactNode } from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

export const NavBar = () => {

    const menuLogo: ReactNode = (<img src="/menu.svg" alt="Menu" id="menu-icon" />)

    if (localStorage.getItem('token')){
        return (
            <Nav>
                <NavDropdown title={menuLogo} id="basic-nav-dropdown">
                    <NavDropdown.Item href="/home">Home</NavDropdown.Item>
                    {/* TODO: replace the route with the user's actual IDs or a 
                        Login item if the user is not logged in. Also disable all 
                        other routes if user is not logged in */}
                    <NavDropdown.Item href="/users/1">Account</NavDropdown.Item>
                    {/* TODO: only show the route to all users for admin users */}
                    <NavDropdown.Item href="/users">Users</NavDropdown.Item>
                    <NavDropdown.Item href="/certificates">Certificates</NavDropdown.Item>
                    <NavDropdown.Item href="/agencies">Agencies</NavDropdown.Item>
                    <NavDropdown.Item href="/get_reports">Get Reports</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        )
    } else {
        return (
            <Nav>
                <NavDropdown title={menuLogo} id="basic-nav-dropdown">
                    <NavDropdown.Item href="/home">Home</NavDropdown.Item>
                    <NavDropdown.Item href="/signin">Sign In</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        )
    }
        
}