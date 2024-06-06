import "./CollectorCard.css";
import { Card, Image, Collapse } from "react-bootstrap";
import { useState } from "react";
import { FaMinus  } from "react-icons/fa6";
import { IoMailOutline } from "react-icons/io5";


export default function CollectorCard ({collector}) {

    const [open, setOpen] = useState(false);

    return (
        <>
        <Card className="my-5 text-center" id="collectorCard">
            <Card.Body>
                <Image src={collector.avatar} alt={`${collector.name} ${collector.surname}`} roundedCircle/>
                <Card.Title className="mb-2">{collector.name} {collector.surname}</Card.Title>
                    <div className="d-flex justify-content-center mt-3">
                        <button className="btn-icon btn-violet" onClick={() => setOpen(!open)} aria-controls="collector-info" aria-expanded={open} >
                            {!open && <IoMailOutline/>}
                            {open && <FaMinus/>}
                        </button>
                    </div>                    
                <Collapse in={open}>
                    <div className="mt-3">
                        <Card.Text><strong>Username:</strong> {collector.username}</Card.Text>
                        <Card.Text><strong>Email:</strong> {collector.email}</Card.Text>
                        <Card.Text><strong>City:</strong> {collector.city}</Card.Text>
                        <Card.Text><strong>State:</strong> {collector.state}</Card.Text>
                    </div>
                </Collapse>
            </Card.Body>
        </Card>
        </>
    )
}