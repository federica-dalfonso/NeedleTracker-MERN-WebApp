import "./ArticlePage.css";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../authorizations/AuthContext";
import { useParams } from "react-router-dom";
import NavbarApp from "../../components/_headers/NavbarApp";
import LoaderBars from "../../components/_loaders/LoaderBars";
import Footer from "../../components/_footer/Footer";
import parse from 'html-react-parser';
import Alert from "../../components/_alert/Alert";


export default function ArticlePage () {

    //stato per articolo:
    const [article, setArticle] = useState("");

    //stato loading:
    const [bar, setBar] = useState(false);
    const [alert, setAlert] = useState(null);

    //recupero l'id del post dall'url
    let { articleId } = useParams();
    articleId = articleId.slice(1);

    //currentUser
    const { currentUser } = useContext(AuthContext);

    //get singolo articolo:
    const getArticle = async () => {
        setBar(true);
        try {
            const response = await fetch(`http://localhost:3003/blog/article/${articleId}`);
            if(response.ok) {
                const articleMag = await response.json();
                setArticle(articleMag);
            } else {
                console.error(`Error in response: ${response.status} ${response.statusText}`);
                setAlert({ message: `An error occurred: ${response.statusText}`, type: "error" });
            }
        } catch (error) {
            console.error("Request failed:", error);
            setAlert({ message: "We're sorry! An error occurred while processing your request, please try again later.", type: "error" });
        } finally {
            setBar(false)
        }
    }

    useEffect(() => {
        getArticle()
    }, [])


    return (
        <>
        <NavbarApp userInfo={currentUser}/>
        <Container className="my-5">
            {bar && <LoaderBars/>}
            {article && 
            <Row>
                <Col md={8}>
                    <div className="d-flex flex-column gap-4 pe-4">
                       <h1 className="justify">{article.title}</h1>
                       <div className="justify resume-border d-flex justify-content-center align-items-center ms-4">
                            <h3 className="fs-5 ps-4">{article.resume} </h3>
                       </div> 
                       <div className="justify">
                            {parse(article.content)}
                        </div>                    
                    </div>                    
                </Col>
                <Col md={4}>
                    <div className="article-image-container">
                        <div className="article-image" style={{ backgroundImage: `url(${article.cover})` }}/>
                    </div>
                    <div className="mt-4">
                        <p className="text-muted">written by</p>
                        <div className="d-flex align-items-center gap-3">
                            <Image src={article._author.avatar} alt="Author Avatar" className="author-avatar" />
                            <p className="p-0 m-0 fs-6">{article._author.name} {article._author.surname}</p>
                        </div>                       
                    </div>
                </Col>
            </Row>}
        </Container>
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        <Footer/>
        </>
    )
}