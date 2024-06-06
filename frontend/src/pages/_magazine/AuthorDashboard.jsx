import "./AuthorDashboard.css";
import { Container, Row, Col } from "react-bootstrap";
import LoaderBars from "../../components/_loaders/LoaderBars";
import NavbarApp from "../../components/_headers/NavbarApp";
import AuthorSidebar from "../../components/_authorsarea/AuthorSidebar";
import AddArticle from "../../components/_authorsarea/_articles/AddArticle";
import ArticleList from "../../components/_authorsarea/_articles/ArticleList";
import AuthorsList from "../../components/_authorsarea/_authors/AuthorsList";
import AddAuthor from "../../components/_authorsarea/_authors/AddAuthor";
import AuthorProfile from "../../components/_authorsarea/_authors/AuthorProfile";
import Footer from "../../components/_footer/Footer";
import Alert from "../../components/_alert/Alert.jsx";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../authorizations/AuthContext";

export default function AuthorDashboard ({convertFile}) {

    //recupero i dati necessari dal context:
    const { authToken, currentUser, loadingUserInfo } = useContext(AuthContext); 

    //stato spinner:
    const [ bar, setBar ] = useState(false);
    const [alert, setAlert] = useState(null);

    //stato autore:
    const [ author, setAuthor ] = useState({});
    //stato tutti gli articoli dell'autore:
    const [ articles, setArticles ] = useState([]);
    //stato lista altri autori:
    const [ allAuthors, setAllAuthors ] = useState([]);

    //fetch get autore loggato:
    const getAuthor = async () => {
        try {
            setBar(true);
            const response = await fetch(`http://localhost:3003/adminarea/author/${currentUser._id}`, {
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if(response.ok) {
                const currentData = await response.json();
                setAuthor(currentData);
                
            } else {
                console.error(`Error in response: ${response.status} ${response.statusText}`);
                setAlert({ message: `An error occurred: ${response.statusText}`, type: "error" });
            }            
        } catch (error) {
            console.error("Request failed:", error);
            setAlert({ message: "We're sorry! An error occurred while processing your request, please try again later.", type: "error" });
        } finally {
            setBar(false);
        }
    };

    //fetch get articoli dell'autore: 
    const getArticles = async () => {
        try {
            setBar(true);
            const response = await fetch(`http://localhost:3003/adminarea/articles/${currentUser._id}/all`, {
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if(response.ok) {
                const articlesList = await response.json();
                setArticles(articlesList);
                setBar(false);
            } else {
                console.error(`Error in response: ${response.status} ${response.statusText}`);
                setAlert({ message: `An error occurred: ${response.statusText}`, type: "error" });
            }
        } catch (error) {
            console.error("Request failed:", error);
            setAlert({ message: "We're sorry! An error occurred while processing your request, please try again later.", type: "error" });
        }
    }

    useEffect(() => {
        if(currentUser && authToken) {
            getAuthor();
            getArticles();
        }
    }, [])

    //fetch get lista autori:
    const getAllAuthors = async () => {
        setBar(true);
        try {
            const response = await fetch(`http://localhost:3003/adminarea/authors`, {
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if(response.ok) {
                const authorsList = await response.json();
                setAllAuthors(authorsList);
                setBar(false);
            } else {
                console.error(`Error in response: ${response.status} ${response.statusText}`);
                setAlert({ message: `An error occurred: ${response.statusText}`, type: "error" });
            }
        } catch (error) {
            console.error("Request failed:", error);
            setAlert({ message: "We're sorry! An error occurred while processing your request, please try again later.", type: "error" });
        }
    }

    //stato di renderizzazione componenti:
    const [activeComponent, setActiveComponent] = useState("articleList");
    const renderComponent = () => {
        switch (activeComponent) {
            case "addArticle":
                return <AddArticle setArticles={setArticles} convertFile={convertFile} />;
            case "authorsList":
                return <AuthorsList getAllAuthors={getAllAuthors} allAuthors={allAuthors} setAllAuthors={setAllAuthors}/>;
            case "addAuthor":
                return <AddAuthor allAuthors={allAuthors} setAllAuthors={setAllAuthors}/>;
            default:
                return (
                    <>
                    {bar ? <LoaderBars/> : <AuthorProfile author={author} setAuthor={setAuthor} convertFile={convertFile} />}
                    {bar ? <LoaderBars/> : <ArticleList setArticles={setArticles} articles={articles} convertFile={convertFile} />}                                            
                    </>
                );
        }
    };

    //loader in attesa del caricamento di dati
    if (loadingUserInfo || !currentUser) {
        return <LoaderBars />;
    }

    return (
        <>
        <NavbarApp userInfo={author}/>
        <Container className="mb-5">
            <Row>
                <Col sm={12} className="text-center">
                    <h4 className="my-5">{`Welcome to your personal area, ${currentUser.name}!`}</h4>
                </Col>
                <Col sm={4}>
                    <AuthorSidebar onNavigate={setActiveComponent} />
                </Col>
                <Col sm={8}>
                    <div className="content">
                        {renderComponent()}
                    </div>
                </Col>
            </Row>
        </Container>    
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        <Footer/>
        </>
    )
}