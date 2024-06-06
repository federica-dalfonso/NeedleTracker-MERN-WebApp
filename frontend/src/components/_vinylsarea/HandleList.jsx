import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../authorizations/AuthContext';
import Alert from "../_alert/Alert";
import SpinnerOver from "../_loaders/SpinnerOver";
import VinylCard from './VinylCard';

export default function HandleList({ vinylist, searchResult }) {

    const { authToken, currentUser } = useContext(AuthContext);

    //stati per spinner e alert:
    const [alert, setAlert] = useState(null);
    const [spin, setSpin] = useState(false);

    //renderizzazone risultati di ricerca:
    const [showAllVinyls, setShowAllVinyls] = useState(true); 

    useEffect(() => {
        if (searchResult.length > 0) {
        setShowAllVinyls(false);
        }
    }, [searchResult]);

    //stato wishlist:
    const [wishlist, setWishlist] = useState([]);
    //GET wishlist 
    const getUserWishlist = async () => {
        try {
            const response = await fetch(`http://localhost:3003/tracker/wishlist/${currentUser._id}/vinylsId`, {
                headers: {
                "Authorization": `Bearer ${authToken}`
                },
            });

            if(response.ok) {
                const userWishlist = await response.json();
                setWishlist(userWishlist);
            } else {
                console.error(`An error occurred: ${response.status} ${response.statusText}`)
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
        }
    }

    useEffect(() => {
        if(currentUser && currentUser._id) {
            getUserWishlist();
        }
    }, [])

    //aggiunta/rimozione dai preferiti:
    const handleToggleWishlist = async (vinyl) => {
        setSpin(true)
        const isInWishlist = wishlist.some((wish) => wish._album === vinyl._id);
        if (!isInWishlist) {
            try {
                const response = await fetch(`http://localhost:3003/tracker/wishlist/vinyls/${currentUser._id}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ _album: vinyl._id })
                });

                if (response.ok) {
                    const addedToWishlist = await response.json();
                    setWishlist((prevWishlist) => [...prevWishlist, addedToWishlist]);
                        } else if (response.status === 409) {
                            console.warn("This vinyl is already in your wishlist!");
                } else {
                console.error(`An error occurred: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.error("Failed to fetch:", error);
            } finally {
                setSpin(false)
            }
        } else {
            setSpin(true)
            try {
                const response = await fetch(`http://localhost:3003/tracker/wishlist/vinyls/${vinyl._id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                if (response.ok) {
                    setWishlist((prevWishlist) => prevWishlist.filter((item) => item._album !== vinyl._id));
                } else {
                    console.error(`An error occurred: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.error("Failed to fetch:", error);
            } finally {
                setSpin(false)
            }
        }
    };


  return (
    <>
        <Container className="my-5">
            {showAllVinyls ? (
            <>
            <div className="text-center mt-3 mb-5">
                <h1 className="titles-hr text-uppercase fs-3 py-3">All Vinyls</h1>
            </div>

            <Row className='g-3'>
                {vinylist && vinylist.map((vinyl, index) => (
                    <Col xs={6} md={4} lg={3} key={index}>
                    <VinylCard vinyl={vinyl} isInWishlist={wishlist.some((wish) => wish._album === vinyl._id)} 
                        handleToggleWishlist={handleToggleWishlist} />
                    </Col>
                ))}

                {vinylist.length === 0 && (
                <div className="text-center my-3">
                    <h6 className="py-3">There are no vinyl records in the list</h6>
                </div>
                )}
            </Row>
            </>
            ) : (
            <>
            <div className="text-center mt-3 mb-5">
              <h1 className="titles-hr text-uppercase fs-3 py-3">Results</h1>
            </div>

            <Row className='g-3'>
              {searchResult && searchResult.map((vinyl, index) => (
                <Col xs={6} md={4} lg={3} key={index}>
                  <VinylCard vinyl={vinyl} isInWishlist={wishlist.some((wish) => wish._album === vinyl._id)} 
                    handleToggleWishlist={handleToggleWishlist} />
                </Col>
              ))}
            </Row>

            {searchResult.length === 0 && (
              <div className="text-center mt-3 mb-5">
                <h6 className="py-3">No results found</h6>
              </div>
            )}

            <div className="text-center my-3">
              <button className='btn-white btn-padding' onClick={() => setShowAllVinyls(true)}>Back to All Vinyls</button>
            </div>
            </>
            )}
      </Container>

      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      {spin && <SpinnerOver />}
    </>
  );
}
