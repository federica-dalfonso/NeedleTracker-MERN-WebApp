import "./VinylDetailPage.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../authorizations/AuthContext";
import { useParams } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import NavbarApp from "../../components/_headers/NavbarApp";
import LoaderBars from "../../components/_loaders/LoaderBars";
import SpinnerOver from "../../components/_loaders/SpinnerOver";
import Alert from "../../components/_alert/Alert";
import VinylPublicDetails from "../../components/_vinylsarea/VinylPublicDetails";
import ModifyVinyl from "../../components/_vinylsarea/ModifyVinyl";
import Footer from "../../components/_footer/Footer";

export default function VinylDetailPage ({convertFileToUrl}) {

    //stato per singolo vinile:
    const [singleVinyl, setSingleVinyl] = useState("");

    //stato loading:
    const [bar, setBar] = useState(false);
    //stati per spinner e alert:
    const [alert, setAlert] = useState(null);
    const [spin, setSpin] = useState(false);

    //recupero l'id del vinile dall'url
    let { vinylId } = useParams();
    vinylId = vinylId.slice(1);

    //currentUser
    const { currentUser, authToken } = useContext(AuthContext);

    //get sul singolo vinile:
    const getSingleVinyl = async () => {
        setBar(true);
        try {
            const response = await fetch(`http://localhost:3003/tracker/vinyl/${vinylId}`, {
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if(response.ok) {
                const vinylInfo = await response.json();
                setSingleVinyl(vinylInfo);
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
        getSingleVinyl();
    }, [])    

    return (
        <>
        <NavbarApp userInfo={currentUser}/>
        <Container className="my-5">
            {bar && <LoaderBars />}
            {(singleVinyl && singleVinyl._user[0]._id !== currentUser._id) &&               
              <VinylPublicDetails singleVinyl={singleVinyl}/>  }
        </Container>
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        {spin && <SpinnerOver/>}
        <Footer/>        
        </>
    )
}