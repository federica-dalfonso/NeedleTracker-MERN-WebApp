import { useState, useContext } from 'react';
import { Card, Form, Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import LoaderBars from '../../_loaders/LoaderBars';
import Alert from "../../_alert/Alert";
import { AuthContext } from '../../../authorizations/AuthContext';

export default function AuthorProfile({ author, setAuthor, convertFile }) {

    //stati per spinner e alert:
    const [alert, setAlert] = useState(null);

    //recupero i dati necessari dal context:
    const { authToken, updateUserInfo, currentUser, logout } = useContext(AuthContext); 

    //bottone dropdown modifica/annulla:
    const [isEditing, setIsEditing] = useState(false);
    const handleEditToggle = () => setIsEditing(!isEditing);

    //author modifica:
    const { name, surname, email, username, avatar, _id } = author;

    //stato di controllo di modifica dell'email:
    const [ emailChanged, setEmailChanged ] = useState(false);

    //stato gestione modifica
    const [ modifyName, setModifyName ] = useState(name);
    const [ modifySurname, setModifySurname ] = useState(surname);
    const [ modifyUsername, setModifyUsername ] = useState(username);
    const [ modifyEmail, setModifyEmail ] = useState(email);
    const [ modifyAvatar, setModifyAvatar ] = useState(null);

    //funzione raccolta dati:
    const handleModyfyProfile = (e) => {
        e.preventDefault();

        const putProfile = {
            _id: _id,
            name: modifyName,
            surname: modifySurname,
            username: modifyUsername,
            email: modifyEmail,
            avatar: modifyAvatar ? modifyAvatar : avatar,
            role: "author"
        }
        updateAuthor(putProfile);
    }

    //update fetch
    const updateAuthor = async (putProfile) => {
        try {
            //upload file avatar:
            if(modifyAvatar) {
              let authorAvatar = await convertFile({files: putProfile.avatar, field: "avatar", isMultiple: false},
                "http://localhost:3003/access/avatar", authToken);
                putProfile.avatar = authorAvatar.avatarUrl;  
            };            

            const response = await fetch(`http://localhost:3003/adminarea/author/${putProfile._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                    "Authorization": `Bearer ${authToken}`,
                },
                body: JSON.stringify(putProfile)
            });
            if(response.ok) {
                const updateAuthor = await response.json();
                setAuthor(updateAuthor);
                updateUserInfo(updateAuthor);

                // Nel caso in cui l'utente abbia modificato l'email è necessario effettuare il login nuovamente:
                if (updateAuthor.email !== email) {
                    setEmailChanged(true);
                    setAlert({ message: "You have changed your email. Please login again to continue!", type: "notify" })
                    const timeout = setTimeout(() => {
                        logout();
                    }, 3500);       
                    return () => clearTimeout(timeout);

                } else {
                    setAlert({ message: "Profile modified successfully!", type: "success" })
                }
                
            } else {
                console.error(`An error occurred: ${response.status} ${response.statusText}`)
            }
        } catch (error) {
            console.error("Failed to fetch:", error)
        } 
    }

    return (
        <Container className='p-2'>
            {(!name || !surname || !email ) && <LoaderBars/>}
            <Card className="rounded-0">
                {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

                <Row className="g-0">
                    <Col md={4}>
                        {avatar ? (
                            <Card.Img src={avatar} className="rounded-0 p-1 author-profile" />
                        ) : (
                            <Card.Img src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" className="rounded-0 p-1" />
                        )}
                    </Col>
                    <Col md={8}>
                        <div className="d-flex flex-column h-100">
                            <Card.Body className="d-flex flex-column justify-content-between h-100">
                                <div>
                                    <Card.Title className='mb-3'>{name} {surname}</Card.Title>
                                    {username && <Card.Subtitle className="mb-3 text-muted">@{username}</Card.Subtitle>}
                                    <Card.Text>{email}</Card.Text>
                                </div>
                                <button className="btn-white btn-padding mt-1 w-50 align-self-end" onClick={handleEditToggle}>
                                    {isEditing ? 'Cancel' : 'Modify'}
                                </button> 
                            </Card.Body>
                        </div>
                    </Col>
                </Row>

                {isEditing && (
                <Card.Body>
                    <Form >
                        <Form.Group controlId="formBasicName" className='mb-2'>
                            <FloatingLabel controlId="floatingName"
                                label="Name">
                                <Form.Control className='input-bord'
                                    type="text" 
                                    value={modifyName} 
                                    onChange={(e) => setModifyName(e.target.value)} 
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group controlId="formBasicSurname" className='mb-2'>
                            <FloatingLabel controlId="floatingSurname"
                                label="Surname">
                                <Form.Control className='input-bord'
                                    type="text" 
                                    value={modifySurname} 
                                    onChange={(e) => setModifySurname(e.target.value)}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group controlId="formBasicUsername" className='mb-2'>
                            <FloatingLabel controlId="floatingUsername"
                                label="Username">
                                <Form.Control className='input-bord'
                                    type="text" 
                                    value={modifyUsername} 
                                    onChange={(e) => setModifyUsername(e.target.value)}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail" className='mb-2'>
                            <FloatingLabel controlId="floatingEmail"
                                label="Email">
                                <Form.Control className='input-bord'
                                    type="email" 
                                    value={modifyEmail} 
                                    onChange={(e) => {
                                        setModifyEmail(e.target.value);                                      
                                    }}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group controlId="formBasicAvatar" className='mb-2'>
                            <FloatingLabel controlId="floatingAvatar"
                                label="Avatar">
                                <Form.Control className='input-bord'
                                    type="file" 
                                    name="avatar"
                                    onChange={(e) => setModifyAvatar(e.target.files[0])}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn-modify btn-padding mt-3"
                            onClick={handleModyfyProfile}>
                                Save Changes
                            </button>
                        </div>
                        
                    </Form>
                </Card.Body>
                )}
            </Card>
        </Container>
    );
}
