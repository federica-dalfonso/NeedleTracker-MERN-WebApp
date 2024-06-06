import { useState, useContext } from 'react';
import { AuthContext } from '../../../authorizations/AuthContext';
import Alert from '../../_alert/Alert';
import Modal from 'react-bootstrap/Modal';
import { MdDeleteForever } from "react-icons/md";

export default function DeleteAuthor ({author, allAuthors, setAllAuthors}) {

    const { name, surname, _id } = author;
    
    const { authToken } = useContext(AuthContext); 

    //stato per alert:
    const [alert, setAlert] = useState(null);

    //stato gestione modale:
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //delete autore: 
    const deleteAuthor = async (_id) => {
        try {
            const response = await fetch(`http://localhost:3003/adminarea/author/${author._id}`, {
                method: "DELETE",
                headers: { 
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if(response.ok) {
                setAllAuthors(allAuthors.filter(author => author._id !== _id));
                handleClose();
                setAlert({ message: "Author deleted successfully", type: "success" })                
            } else {
                setAlert({ message: `An error occurred: ${response.statusText}`, type: "error" })
                console.error(`Error in response: ${response.status} ${response.statusText}`)
            }
        } catch (error) {
            console.error("Request failed:", error)
        }
    }

    return (
        <>
        <button className="btn-icon btn-delete" onClick={handleShow}>
            <MdDeleteForever />
        </button>

        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title className='fs-4 text-uppercase'>Delete Author</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                This action will permanently remove <strong>{name} {surname}</strong> from accessing this website 
                and all permissions will be revoked. Are you sure you want to proceed?
            </Modal.Body>

            <Modal.Footer>
                <button className='btn-white btn-padding' onClick={handleClose}>
                    cancel
                </button>
                <button className='btn-modify btn-padding' onClick={deleteAuthor}>Confirm</button>
            </Modal.Footer>
        </Modal>
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        </>
    );
}