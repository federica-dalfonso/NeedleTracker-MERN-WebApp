import "./Jumbotron.css";
import { Container } from "react-bootstrap"

export default function Jumbotron () {

    return (
        <>
        <div id="jumbotron-custom">
            <Container className="text-container">
                <h1 className="display-3 fw-bold">Keep track of your passion <br/> with NeedleTracker</h1>
                <p className="fs-4"> Dive deep into the world of vinyl collecting, stay in the loop, <br/>
                    and connect with fellow music lovers.
                    Join the groove and spin your vinyl journey with us!</p>
                    <div className="scroll-down">
                        <span className="arrow-down"></span>
                    </div>
            </Container>
        </div>        
        </>
    )
}