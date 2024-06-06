import "./NavbarApp.css";
import logoBlack from "../_logo/logo_black.png"
import logoWhite from "../_logo/logo_white.png"
import { Navbar, Nav, Container, NavDropdown, Image } from 'react-bootstrap';
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../authorizations/AuthContext";

export default function NavbarApp({ userInfo }) {

    const { logout } = useContext(AuthContext);

    const location = useLocation()

    return (
        <>
        <Navbar collapseOnSelect expand="md" variant={location.pathname === "/authorsarea" ? "light" : "dark"} 
            className={location.pathname === "/authorsarea" ? "bg-custom-light" : "bg-custom-dark"}>
            <Container>
                <Navbar.Brand as={Link} to="/" className="py-0">
                    <img id="navbarLogo" src={location.pathname === "/authorsarea" ? logoBlack : logoWhite} alt="NeedleTracker logo"/>                   
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav className="w-100 justify-content-md-end text-center">
                        <Nav.Link as={Link} to="/">Magazine</Nav.Link>
                        {userInfo && userInfo.role === "collector" && (
                            <>
                                <Nav.Link as={Link} to="/tracker">Vinyls</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {!userInfo ? (
                            <Nav.Link as={Link} to="/login" className="login-btn ms-md-2 my-sm-3 my-md-0">Login</Nav.Link>
                        ) : (
                            <NavDropdown 
                                id="basic-nav-dropdown"
                                className={`ms-md-2 my-sm-3 my-md-0 ${location.pathname === "/authorsarea" ? "bg-dropdown-light" : "bg-dropdown-dark"}`}
                                title={
                                    <>
                                        <Image src={userInfo.avatar} className="btn-img-user" roundedCircle />
                                        {userInfo.name}
                                    </>
                                }                             
                            >
                                {userInfo.role === "author" && 
                                    <>
                                        <NavDropdown.Item as={Link} to="/authorsarea">Dashboard</NavDropdown.Item>
                                        <NavDropdown.Item as="button" onClick={logout}>Logout</NavDropdown.Item>
                                    </>
                                }
                                {userInfo.role === "collector" && 
                                    <>
                                        <NavDropdown.Item as={Link} to="/tracker/mydashboard">My Tracker</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/tracker/wishlist">Wishlist</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/tracker/profile">My Profile</NavDropdown.Item>
                                        <NavDropdown.Item as="button" onClick={logout}>Logout</NavDropdown.Item>
                                    </>
                                }                                
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>  
        </>
    );
}