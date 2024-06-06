import "./LoginPage.css";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useContext } from "react";
import { AuthContext } from "../../authorizations/AuthContext";
import NavbarApp from "../../components/_headers/NavbarApp";
import LoginForm from "../../components/_login/LoginForm";
import RegisterForm from "../../components/_login/RegisterForm";
import MiniCarousel from "../../components/_login/MiniCarousel";
import Footer from "../../components/_footer/Footer";
import Alert from "../../components/_alert/Alert";
import SpinnerOver from "../../components/_loaders/SpinnerOver";


export default function LoginPage ({convertFile}) {

    //context
    const { login } = useContext(AuthContext);

    //gestione renderizzazione forms:
    const [showLogin, setShowLogin] = useState(true);
    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    //gestione autore o collector:
    const [isAuthor, setIsAuthor] = useState(false);

    //stati per spinner e alert:
    const [alert, setAlert] = useState(null);
    const [spin, setSpin] = useState(false);

    //fetch post login:
    const userLogin = async (userData) => {
        setSpin(true);
        try {
            if (userData) {
                const response = await fetch("http://localhost:3003/access/login", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(userData)
                });

                if(response.ok) {
                    const loggedUser = await response.json();
                    login(loggedUser.token);
                    setAlert({ message: "Login successfully!", type: "success" })
                } else {                    
                    setAlert({ message: "Need an account? Register now!", type: "notify" })
                    setShowLogin(false);
                }
            }
        } catch (error) {
            console.error("Request failed:", error)
        } finally {
            setSpin(false);
        }
    }

    return (
        <div className="h-box">
            <NavbarApp />
            <div className="content-wrapper">
                <Container className="my-5">
                    <Row className="justify-content-center align-items-center">
                        <Col sm={12} md={6}>
                            {showLogin ? <LoginForm isAuthor={isAuthor} setIsAuthor={setIsAuthor} onLogin={userLogin} /> : <RegisterForm convertFile={convertFile} setShowLogin={setShowLogin} />}
                            <Button variant="link" onClick={toggleForm} className={`link-to my-3 ms-auto ${!isAuthor ? "visible" : "invisible"}`}>
                                {showLogin ? 'New? Register here' : 'Already user? Login here'}
                            </Button>
                        </Col>
                        <Col md={6} className="d-none d-md-block">
                            <div className="carousel-wrapper">
                                <MiniCarousel />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            {spin && <SpinnerOver />}
        </div>
    )
}