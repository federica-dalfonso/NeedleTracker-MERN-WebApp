import { Form, FloatingLabel } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { AuthContext } from '../../../authorizations/AuthContext';
import Alert from "../../_alert/Alert";
import SpinnerOver from "../../_loaders/SpinnerOver";


export default function AddAuthor ( {allAuthors, setAllAuthors} ) {

    const { authToken } = useContext(AuthContext); 

    //stati per spinner e alert:
    const [alert, setAlert] = useState(null);
    const [spin, setSpin] = useState(false);

    //stato dati nuovo autore:
    const [newName, setNewName] = useState("");
    const [newSurname, setNewSurname] = useState("");
    const [newEmail, setNewEmail] = useState("");

    //funzione raccolta dati:
    const handleNewAuthor = (e) => {
        e.preventDefault();
        
        if(!newName || !newSurname || !newEmail) {
            alert("Fileds required")
        } else {
            const newData = {
                name: newName,
                surname: newSurname,
                email: newEmail,
                role: "author", 
                avatar: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
            }
            postNewAuthor(newData);
        }
    }

    //reset fields:
    const resetForm = () => {
        setNewName("");
        setNewSurname("");
        setNewEmail("");
    }

    //fetch post nuovo autore:
    const postNewAuthor = async (newData) => {
        setSpin(true);
        try {
            const response = await fetch(`http://localhost:3003/adminarea/authors/new`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(newData)
            });
            if(response.ok) {
                const newAuthor = await response.json();
                setAllAuthors(prev => [...prev, newAuthor]);
                setAlert({ message: "Author registered successfully!", type: "success" })
                resetForm();
            } else {
                console.error(`An error occurred: ${response.status} ${response.statusText}`);
                setAlert({ 
                    message: `We're sorry, there's' an error in your request: (${response.statusText}). 
                    Please check your input and try again, or contact support if the issue persists.`, 
                    type: "error" 
                });
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setSpin(false);
        }
    }

    return (
        <>
        <Form className='mt-4 mb-5 px-3'>
                <Form.Group controlId="formBasicName" className='mb-2'>
                    <FloatingLabel controlId="floatingName"
                    label="Name">
                        <Form.Control className='input-bord' type="text" 
                            value={newName} onChange={(e) => setNewName(e.target.value)}  
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formBasicSurname" className='mb-2'>
                    <FloatingLabel controlId="floatingSurname"
                    label="Surname">
                        <Form.Control className='input-bord' type="text" 
                            value={newSurname} onChange={(e) => setNewSurname(e.target.value)}
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formBasicEmail" className='mb-2'>
                    <FloatingLabel controlId="floatingEmail"
                    label="Email">
                        <Form.Control className='input-bord' type="email" 
                            value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className="d-flex mt-3 justify-content-end gap-3">
                    <button type="reset" className='btn-white btn-padding' onClick={resetForm}>
                        Reset
                    </button>

                    <button type="submit" className='btn-modify btn-padding' onClick={handleNewAuthor}>
                        register
                    </button>
                </Form.Group>         
        </Form>
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        {spin && <SpinnerOver />}
        </>
    )
}