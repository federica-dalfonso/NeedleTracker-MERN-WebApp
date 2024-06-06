import { useState, useContext } from 'react';
import { AuthContext } from '../../../authorizations/AuthContext';
import Modal from 'react-bootstrap/Modal';
import Alert from "../../_alert/Alert";
import { MdDeleteForever } from "react-icons/md";

export default function DeleteArticle ({single, articles, setArticles}) {
    
    const { authToken } = useContext(AuthContext); 

    //stato per alert:
    const [alert, setAlert] = useState(null);

    //stato gestione modale:
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //delete dell'articolo:
    const deleteArticle = async () => {
        try {
            const response = await fetch(`http://localhost:3003/adminarea/article/${single._id}`, {
                method: "DELETE",
                headers: { 
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if(response.ok) {
                setArticles(articles.filter(art => art._id !== single._id));
                setAlert({ message: "Article deleted successfully", type: "success" })
                handleClose();
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
                <Modal.Title className='fs-4 text-uppercase'>Delete Article</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                This action will permanently remove your article from the page. Are you sure you want to continue?
            </Modal.Body>
            <Modal.Footer>
                <button className='btn-white btn-padding' onClick={handleClose}>
                    cancel
                </button>
                <button className='btn-padding btn-modify' onClick={deleteArticle}>
                    Confirm
                </button>
            </Modal.Footer>
        </Modal>
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        </>
    );
}