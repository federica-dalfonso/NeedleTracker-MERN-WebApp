import { Row, Col, Card, Modal } from "react-bootstrap";
import CollectorCard from "../../components/_vinylsarea/CollectorCard";
import { useState } from "react";

export default function VinylPublicDetails ({singleVinyl}) {

    //modale foto:
    const [show, setShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    //immagini:
    const handleShow = (image) => {
        setSelectedImage(image);
        setShow(true);
    };
    //immagini:
    const handleClose = () => {
        setShow(false);
    };

    return ( 
        <>
        {singleVinyl &&
        <Row className="g-3">
            <Col md={4}>
                <Row className="mb-3">
                    <Col>
                        <Card.Img 
                            variant="top" 
                            src={singleVinyl.photos[0]} 
                            className="img-thumbnail large-image" 
                            onClick={() => handleShow(singleVinyl.photos[0])} 
                        />
                    </Col>
                </Row>
                <Row>
                    {singleVinyl.photos.slice(1).map((image, index) => (
                        <Col key={index} xs={6}>
                            <Card.Img 
                                variant="top" 
                                src={image} 
                                className="img-thumbnail small-image" 
                                onClick={() => handleShow(image)} 
                            />
                        </Col>
                    ))}
                </Row>
            </Col>
            <Col md={8} className="d-flex justify-content-center align-items-center">
                <div className="ps-md-5">
                    <div className="mb-3">
                        <h2>{singleVinyl.title}</h2>
                        <h3>{singleVinyl.artist}</h3>
                    </div>                            
                    <p className="mb-3"><strong>Genre:</strong> {singleVinyl.genre}</p>
                    <p className="mb-3"><strong>Year:</strong> {singleVinyl.yearOfRel}</p>
                    <p className="mb-3"><strong>Country of Release:</strong> {singleVinyl.countryOfRel}</p>
                    <p className="mb-3"><strong>Label:</strong> {singleVinyl.label}</p>
                    <p className="mb-3"><strong>Format:</strong> {singleVinyl.format}</p>
                    <p><strong>Condition:</strong> {singleVinyl.condition}</p>
                    <p>{singleVinyl.description}</p>
                </div>                        
            </Col>
            <Col xs={12}>
                <div className="text-center mt-5">
                    <h1 className="fs-5">Interested in learning more about this vinyl? <br/>
                    Contact the collector to ask questions or suggest a swap!</h1>
                </div>
                <CollectorCard collector={singleVinyl._user[0]}/>
            </Col>
        </Row>
        }
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body>
                <img src={selectedImage} alt="Selected Vinyl" className="img-fluid" />
            </Modal.Body>
        </Modal>
        </>
    )
}