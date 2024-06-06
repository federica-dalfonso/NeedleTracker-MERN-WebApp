import { useState, useContext } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { ImPencil } from "react-icons/im";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Alert from "../../_alert/Alert";
import SpinnerOver from "../../_loaders/SpinnerOver";
import { AuthContext } from '../../../authorizations/AuthContext';

export default function ModifyArticle ({single, setArticles, convertFile}) {

    //stati per spinner e alert:
    const [alert, setAlert] = useState(null);
    const [spin, setSpin] = useState(false);

    //stati modal:
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { authToken, currentUser } = useContext(AuthContext); 

    //destrutturazione articolo da modificare:
    const { category, title, resume, content, cover, _id } = single;

    //stato gestione modifiche:
    const [modifyCategory, setModifyCategory ] = useState(category);
    const [modifyTitle, setModifyTitle ] = useState(title);
    const [modifyCover, setModifyCover ] = useState(null);
    const [modifyResume, setModifyResume ] = useState(resume);
    const [modifyContent, setModifyContent ] = useState(content);
    const handleQuillChange = (value) => {
        setModifyContent(value)
    };

    //funzione raccolta dati:
    const handleModifyArticle = (e) => {
        e.preventDefault();
        
        const putArticle = {
            _id: _id,
            category: modifyCategory,
            title: modifyTitle,
            cover: modifyCover ? modifyCover : cover,
            resume: modifyResume,
            content: modifyContent,
            _author: currentUser._id
        }

        updateArticle(putArticle);        
    }

    //fetch put:
    const updateArticle= async (putArticle) => {
        setSpin(true);
        try {
            if(modifyCover) {
                //caricamento immagine in cloudinary: 
                let articleCover = await convertFile({files: putArticle.cover, field: "cover", isMultiple: false},
                "http://localhost:3003/adminarea/article/cover", authToken);
                putArticle.cover = articleCover.coverUrl;   
            }
            
            //fetch put:
            const response = await fetch(`http://localhost:3003/adminarea/article/${putArticle._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                    "Authorization": `Bearer ${authToken}`,
                },
                body: JSON.stringify(putArticle)
            });
            if(response.ok) {
                const updatedArticle = await response.json();
                setArticles(prevArticles => prevArticles.map(article => 
                    article._id === updatedArticle._id ? updatedArticle : article
                ));
                setSpin(false);
                setAlert({ message: "Article modified successfully", type: "success" })
                handleClose();
            } else {
                setAlert({ message: `An error occurred: ${response.statusText}`, type: "error" })
                console.error(`An error occurred: ${response.status} ${response.statusText}`)
            }
        } catch (error) {
            console.error("Failed to fetch:", error)
        }
    }

    return (
        <>
        <button className="btn-icon btn-modify" onClick={handleShow}>
            <ImPencil />
        </button>

        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} id="modify-article"> 
            <Modal.Header closeButton>
                <Modal.Title>Edit Article</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form className='mb-3 mx-3'>
                {spin && <SpinnerOver />}

                    <Form.Group controlId="blog-category" className="mt-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select" className='input-bord' 
                        value={modifyCategory} onChange={(e) => setModifyCategory(e.target.value)}
                        >
                            <option>Select a category</option>
                            <option value="vinyl reviews">Vinyl Reviews</option>
                            <option value="collecting tips">Collecting Tips</option>
                            <option value="vinyl culture">Vinyl Culture</option>
                            <option value="sound systems">Sound Systems</option>                    
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="blog-title" className="mt-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control placeholder="Title here" className='input-bord'
                        value={modifyTitle} onChange={(e) => setModifyTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="blog-img" className="mt-3">
                        <div className='d-flex align-items-center gap-3'>
                            {cover && 
                                <img className='preview-article-img-size' src={cover} alt="Anteprima immagine di copertina"/>}
                                <div className='w-100'>
                                    <Form.Label>Cover image</Form.Label>
                                    <Form.Control type="file" name="cover" className='input-bord'
                                    onChange={(e) => setModifyCover(e.target.files[0])}/>
                                </div>                                
                        </div>
                        
                    </Form.Group>

                    <Form.Group controlId="blog-resume" className="mt-3">
                        <Form.Label>Resume</Form.Label>
                        <Form.Control as="textarea" placeholder="A little resume here" className='input-bord'
                        value={modifyResume} onChange={(e) => setModifyResume(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="blog-content" className="mt-3">
                        <Form.Label>Content</Form.Label>
                        <ReactQuill className='input-bord' theme="snow"
                        value={modifyContent}
                        onChange={handleQuillChange} required
                        />
                    </Form.Group>

                </Form>
            </Modal.Body>

            <Modal.Footer>
                <button className='btn-white btn-padding' onClick={handleClose}>
                    close
                </button>
                <button className='btn-modify btn-padding' onClick={handleModifyArticle}>
                    save
                </button>
            </Modal.Footer>
        </Modal>
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        </>
    );
}
