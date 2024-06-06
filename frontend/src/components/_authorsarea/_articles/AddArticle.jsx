import { Form } from 'react-bootstrap';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../authorizations/AuthContext';
import Alert from '../../_alert/Alert';
import SpinnerOver from "../../_loaders/SpinnerOver";

export default function AddArticle ( {setArticles, convertFile} ) {

    const { authToken, currentUser } = useContext(AuthContext); 

    //stati per spinner e alert:
    const [alert, setAlert] = useState(null);
    const [spin, setSpin] = useState(false);

    //fetch post nuovo articolo:
    const postArticle = async (articleData) => {
        setSpin(true);
        try {
            //upload file cover:
            let articleCover = await convertFile({files: articleData.cover, field: "cover", isMultiple:false},
            "http://localhost:3003/adminarea/article/cover", authToken);
            articleData.cover = articleCover.coverUrl;

            //post articolo
            const response = await fetch(`http://localhost:3003/adminarea/articles`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(articleData)
            });
            if(response.ok) {
                const newArticle = await response.json();
                setArticles(prev => [...prev, newArticle]);
                resetForm();
                setAlert({ message: "Article saved successfully!", type: "success" })                 
            } else {
                console.error(`An error occurred: ${response.status} ${response.statusText}`)
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
    };

    //raccolgo input nuovo articolo:
    const [articleCategory, setArticleCategory ] = useState("");
    const [articleTitle, setArticleTitle ] = useState("");
    const [articleCover, setArticleCover ] = useState("");
    const [articleResume, setArticleResume ] = useState("");
    const [articleContent, setArticleContent] = useState(``);
    const handleQuillChange = (value) => {
        setArticleContent(value)
    };

    //reset fields:
    const resetForm = () => {
        setArticleCategory("");
        setArticleTitle("");
        setArticleCover("");
        setArticleResume("");
        setArticleContent("");
    }

    const handleNewArticle = (e) => {
        e.preventDefault();
        if(!articleCategory || !articleTitle || !articleCover || !articleResume || !articleContent) {
            setAlert({ message: "All fields are required, please try again!", type: "error" })  
        } else {
            const articleData = {
                category: articleCategory,
                title: articleTitle,
                cover: articleCover,
                resume: articleResume,
                content: articleContent,
                _author: currentUser._id
            }
            postArticle(articleData);
        }
    }

    return (
        <>
        <Form onSubmit={handleNewArticle} className='mb-5 mt-4 px-3'>

            <Form.Group controlId="blog-category" className="mt-3">
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" className='input-bord' 
                value={articleCategory} onChange={(e) => setArticleCategory(e.target.value)}
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
                value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="blog-img" className="mt-3">
                <Form.Label>Cover image</Form.Label>
                <Form.Control type="file" name="cover" className='input-bord'
                onChange={(e) => setArticleCover(e.target.files[0])}/>
            </Form.Group>

            <Form.Group controlId="blog-resume" className="mt-3">
                <Form.Label>Resume</Form.Label>
                <Form.Control as="textarea" placeholder="A little resume here" className='input-bord'
                value={articleResume} onChange={(e) => setArticleResume(e.target.value)}/>
            </Form.Group>

            <Form.Group controlId="blog-content" className="mt-3">
                <Form.Label>Content</Form.Label>
                <ReactQuill className='input-bord' theme="snow"
                onChange={handleQuillChange} required/>
            </Form.Group>

            <Form.Group controlId="blog-author" className="mt-3">
                <Form.Label>Author</Form.Label>
                <Form.Control as="select" className='input-bord'>
                    <option>Select an author</option>
                    <option value={currentUser._id}>{currentUser.name} {currentUser.surname}</option>                  
                </Form.Control>
            </Form.Group>

            <Form.Group className="d-flex mt-3 justify-content-end gap-3">
                <button type="reset" className='btn-white btn-padding' onClick={resetForm}>
                    Reset
                </button>

                <button type="submit" className='btn-padding btn-modify'>
                    Save and Post
                </button>
            </Form.Group>

        </Form>
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        {spin && <SpinnerOver />}
        </>
    )
}