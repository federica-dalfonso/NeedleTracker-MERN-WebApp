import NavbarApp from "../../components/_headers/NavbarApp.jsx";
import Jumbotron from "../../components/_headers/Jumbotron.jsx";
import AllArticles from "../../components/_magazine/AllArticles.jsx";
import Footer from "../../components/_footer/Footer.jsx";
import LoaderBars from "../../components/_loaders/LoaderBars.jsx";
import Alert from "../../components/_alert/Alert.jsx";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../authorizations/AuthContext.jsx";

export default function Magazine () {

    const  { currentUser } = useContext(AuthContext);

    //stato spinner & alert:
    const [ bar, setBar ] = useState(false);
    const [alert, setAlert] = useState(null);

    //stato articleData:
    const [ articleList, setArticleList ] = useState([]);

    const getArticleList = async () => {
        setBar(true);
        try {
            const response = await fetch("http://localhost:3003/blog/articles");

            if(response.ok) {
                const dataArticle = await response.json();
                setArticleList(dataArticle);
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
    }

    useEffect(() => {
        getArticleList();
    }, [])
   
    return (
        <>
        <NavbarApp userInfo={currentUser}/>
        <Jumbotron/>
        {bar? <LoaderBars/> : <AllArticles articleList={articleList}/>}        
        <Footer/>
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        </>
    )
}