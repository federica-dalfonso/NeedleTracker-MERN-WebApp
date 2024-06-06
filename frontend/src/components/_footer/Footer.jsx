import "./Footer.css";
import logoFooter from "../_logo/logo_footer.png";
import { Container, Row, Col } from 'react-bootstrap';
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer () {

    return (
        <>
        <footer className="footer">
            <Container>
                <Row>
                    <Col md={12} className="d-flex justify-content-between">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <img src={logoFooter} alt="NeedleTracker logo" />
                        <div className="d-flex flex-column">
                            <p className="mb-0">made with love for</p>
                            <p className="mb-0">© 2024 WDPT0523</p>
                        </div>                           
                    </div> 
                    <div className="d-flex flex-column align-items-end">
                        <p className="mb-0">Follow me on</p>
                        <div className="social-icons">
                            <a href="#" className="pe-1"><FaLinkedin /></a>
                            <a href="#"><FaGithub /></a>
                        </div>
                    </div>                    
                    </Col>                                               
                </Row>
            </Container>
        </footer>
        </>
    )
}