import NavbarApp from "../../components/_headers/NavbarApp";
import Footer from "../../components/_footer/Footer";
import { Container, Row, Col, Card, Form, FloatingLabel } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../authorizations/AuthContext";
import Alert from '../../components/_alert/Alert';
import SpinnerOver from "../../components/_loaders/SpinnerOver";
import LoaderBars from "../../components/_loaders/LoaderBars";


export default function CollectorProfilePage () {

    const { currentUser, authToken } = useContext(AuthContext);

    //stato info:
    const [ collector, setCollector ] = useState("");

    //stati per loaders:
    const [bar, setBar ] = useState(false);
    //stati per spinner e alert:
    const [alert, setAlert] = useState(null);
    const [spin, setSpin] = useState(false);

    //bottone dropdown modifica/annulla:
    const [isEditing, setIsEditing] = useState(false);
    const handleEditToggle = () => setIsEditing(!isEditing);

    //get info:
    const getCollector = async () => {
        setBar(true)
        try {
            const response = await fetch (`http://localhost:3003/tracker/collector/${currentUser._id}`, {
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if(response.ok) {
                const collectorData = await response.json();
                setCollector(collectorData);
            } else {
                console.error(`Error in response: ${response.status} ${response.statusText}`)
            }
        } catch (error) {
            console.error("Fetch failed:", error)
        } finally {
            setBar(false)
        }
    }

    useEffect(() => {
        if(currentUser) {
            getCollector()
        }
    }, [])

    return (
        <>
        <NavbarApp userInfo={currentUser}/>
        <Container className="my-5 min-vh-100">
            <Row className='g-3'>
                <div className="text-center mt-3 mb-3">
                    <h1 className="titles-hr text-uppercase fs-3 py-3">My Profile</h1>
                </div>

                {bar ? (<LoaderBars/>) : (
                    <>
                    {collector && 
                    <>
                    <Col xs={12} md={4}>
                        <Card.Img variant="top" src={collector.avatar} 
                            className="img-thumbnail large-image" />
                    </Col>

                    <Col xs={12} md={8}>
                        <div className="d-flex flex-column h-100 grey-bord p-3">
                            <Card.Body className="d-flex flex-column justify-content-between h-100">
                                <div className="ps-2">
                                    <h3 className='mb-3'>{collector.name} {collector.surname}</h3>
                                    <p className="mb-3"><strong>Username:</strong> {collector.username}</p>
                                    <p className="mb-3"><strong>Email:</strong> {collector.email}</p>
                                    <p className="mb-3"><strong>City:</strong> {collector.city}</p>
                                    <p className="mb-3"><strong>State:</strong> {collector.state}</p>                                    
                                </div>
                                <div className="ps-2 mt-2">
                                    <p className="mb-3"><strong>Collection:</strong> {collector._vinyls.length} vinyls</p>
                                    <p className="mb-3"><strong>Wishlist:</strong> {collector._wishlist.length} vinyls</p>
                                </div>

                                <button className="btn-white btn-padding mt-1 w-50 align-self-end" onClick={handleEditToggle}>
                                    {isEditing ? 'Cancel' : 'Modify'}
                                </button> 
                            </Card.Body>
                        </div>                                         
                    </Col>
                    </>
                    }

                    {(isEditing && collector) && (
                    <Card.Body className="mx-4 mt-4">
                        <Form>
                            <Form.Group controlId="formBasicName" className='mb-2'>
                                <FloatingLabel controlId="floatingName" label="Name">
                                    <Form.Control className='input-bord' type="text" 
                                        value={collector.name}
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group controlId="formBasicSurname" className='mb-2'>
                                <FloatingLabel controlId="floatingSurname" label="Surname">
                                    <Form.Control className='input-bord' type="text" 
                                        value={collector.surname}
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group controlId="formBasicUsername" className='mb-2'>
                                <FloatingLabel controlId="floatingUsername" label="Username">
                                    <Form.Control className='input-bord'
                                        type="text" 
                                        value={collector.username}
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail" className='mb-2'>
                                <FloatingLabel controlId="floatingEmail" label="Email">
                                    <Form.Control className='input-bord'
                                        type="email" 
                                        value={collector.email}
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group controlId="formBasicCity" className='mb-2'>
                                <FloatingLabel controlId="floatingCity" label="City">
                                    <Form.Control className='input-bord'
                                        type="text" 
                                        value={collector.city}
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group controlId="formBasicState" className='mb-2'>
                                <FloatingLabel controlId="floatingState" label="State">
                                    <Form.Control className='input-bord'
                                        type="text" 
                                        value={collector.state}
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group controlId="formBasicAvatar" className='mb-2'>
                                <FloatingLabel controlId="floatingAvatar" label="Avatar">
                                    <Form.Control className='input-bord'
                                        type="file"                                         
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn-modify btn-padding mt-3">
                                    Save Changes
                                </button>
                            </div>
                            
                        </Form>
                    </Card.Body>
                    )}                   
                    </>
                )}      
                <Col xs={12}>
                    <div className="mt-3 d-flex justify-content-end">
                        <button className="btn-padding btn-delete">
                            delete profile
                        </button>
                    </div>
                </Col>

            </Row>
        </Container>
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        {spin && <SpinnerOver />}        
        <Footer/>
        
        </>
    )
}