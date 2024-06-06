import NavbarApp from "../../components/_headers/NavbarApp";
import Footer from "../../components/_footer/Footer";
import VinylCard from "../../components/_vinylsarea/VinylCard";
import AddVinyl from "../../components/_vinylsarea/AddVinyl";
import { Container, Row, Col } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../authorizations/AuthContext";
import Alert from '../../components/_alert/Alert';
import SpinnerOver from "../../components/_loaders/SpinnerOver";
import { MdAddBox } from "react-icons/md";

export default function MyTrackerPage ({convertFileToUrl}) {

    const { currentUser, authToken } = useContext(AuthContext);

    //stati per loaders:
    const [bar, setBar ] = useState(false);
    //stati per spinner e alert:
    const [alert, setAlert] = useState(null);
    const [spin, setSpin] = useState(false);

    //stato per lista di vinily user:
    const [ personalVinylist, setPersonalVinylist ] = useState([]);

    // stato per visualizzazione del dropdown AddVinyl:
    const [showAddVinyl, setShowAddVinyl] = useState(false);

    //fetch get lista vinili dell'user:
    const getVinylist = async () => {
        setBar(true)
        if (!currentUser || !currentUser._id) {
            console.error("currentUser or currentUser._id is null");
            return;
        }
        try {
            const response = await fetch(`http://localhost:3003/tracker/${currentUser._id}/vinyls`, {
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });

            if(response.ok) {
                const personalList = await response.json();
                setPersonalVinylist(personalList);
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
        if (currentUser && currentUser._id) {
            getVinylist();
        }        
    }, [currentUser])

    //fetch POST nuovo vinile:
    const postNewVinyl = async (vinylData) => {
        setSpin(true);
        try {
            //caricamento photos:
            let result = await convertFileToUrl({files: vinylData.photos, field: "photos", isMultiple: true}, 
            "http://localhost:3003/tracker/vinyl/photos", authToken);
            vinylData.photos = result.photosUrls;

            //fetch post
            const response = await fetch(`http://localhost:3003/tracker/vinyls`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(vinylData)
            });
            if(response.ok) {
                const newVinyl = await response.json();
                setPersonalVinylist(prev => [...prev, newVinyl]);
                setAlert({ message: "Vinyl addedd successfully!", type: "success" })
            } else {
                console.error(`An error occurred: ${response.status} ${response.statusText}`)
                setAlert({ 
                    message: `Oops! There was an error processing your request:
                    (${response.statusText}). 
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

    // Funzione per mostrare il dropdown AddVinyl:
    const handleShowAddVinyl = () => {
        setShowAddVinyl(prevShowAddVinyl => !prevShowAddVinyl);
    };

    //PATCH modifica isPublic del vinile:
    const patchVinylInfo = async (vinylId, visibility) => {
        setSpin(true);
        try {
            const response = await fetch(`http://localhost:3003/tracker/vinyl/${vinylId}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(visibility)
            });
            if(response.ok) {
                const visibilityModified = await response.json();
                getVinylist()
                setAlert({ message: "Vinyl visibility changed successfully!", type: "success" })
            } else {
                console.error(`An error occurred: ${response.status} ${response.statusText}`)
                setAlert({ 
                    message: `Oops! There was an error processing your request:
                    (${response.statusText}). 
                    Please check your input and try again, or contact support if the issue persists.`, 
                    type: "error" 
                });
            }            
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setSpin(false)
        }
    }

    return (
        <>
        <NavbarApp userInfo={currentUser}/>
        <Container className="my-5 min-vh-100">
            <Row className='g-3'>
                <div className="d-flex justify-content-end gap-3">
                    <button className="btn-padding btn-white d-flex align-items-center gap-1" onClick={handleShowAddVinyl}>
                        {!showAddVinyl ? (
                        <>
                        <MdAddBox /> Add Vinyl
                        </>
                        ) : ("close")}
                    </button>
                </div>                           
                {showAddVinyl && (
                    <div className="w-100">
                        <AddVinyl onNewVinyl={postNewVinyl} setShowAddVinyl={setShowAddVinyl}/>
                    </div>
                )}
                <div className="text-center mb-3">
                        <h1 className="titles-hr text-uppercase fs-3 py-3">My Tracker</h1>
                </div>                                          
                {personalVinylist && personalVinylist.map((vinyl, index) => (
                    <Col xs={12} md={6} lg={3} key={index}>
                        <VinylCard vinyl={vinyl} patchVinylInfo={patchVinylInfo} convertFileToUrl={convertFileToUrl} 
                        personalVinylist={personalVinylist} setPersonalVinylist={setPersonalVinylist}/>
                    </Col>
                ))}
                {personalVinylist.length === 0 && (
                <div className="text-center my-3">
                    <h6 className="py-3">You don't have any vinyl records in the list</h6>
                </div>
                )}                        
            </Row>
        </Container>
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        {spin && <SpinnerOver />}
        
        <Footer/>
        </>
    )
}