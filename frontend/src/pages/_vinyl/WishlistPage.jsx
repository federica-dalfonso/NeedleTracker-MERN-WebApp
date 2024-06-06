import NavbarApp from "../../components/_headers/NavbarApp";
import Footer from "../../components/_footer/Footer";
import WishCard from "../../components/_vinylsarea/WishCard";
import LoaderBars from "../../components/_loaders/LoaderBars";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../authorizations/AuthContext";

export default function WishlistPage () {

    
    //stato spinner e alert:
    const [bar, setBar ] = useState(false);

    const { authToken, currentUser } = useContext(AuthContext);

    //stato wishlist:
    const [wishlist, setWishlist] = useState([]);
    //GET wishlist 
    const getUserWishlist = async () => {
        setBar(true);
        try {
            const response = await fetch(`http://localhost:3003/tracker/wishlist/${currentUser._id}/populate`, {
                headers: {
                "Authorization": `Bearer ${authToken}`
                },
            });

            if(response.ok) {
                const userWishlist = await response.json();
                console.log(userWishlist)
                setWishlist(userWishlist);
            } else {
                console.error(`An error occurred: ${response.status} ${response.statusText}`)
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setBar(false)
        }
    }

    useEffect(() => {
        if(currentUser && currentUser._id) {
            getUserWishlist();
        }
    }, [])

    return (
        <>
        <NavbarApp userInfo={currentUser}/>
            <Container className="my-5 min-vh-100">
                <div className="text-center mt-3 mb-5">
                        <h1 className="titles-hr text-uppercase fs-3 py-3">wishlist</h1>
                </div>
                {bar ? (<LoaderBars/>) : (               <>
                    <Row className='g-3'>
                        {wishlist && wishlist.map((vinyl, index) => (
                            <Col xs={6} md={4} lg={3} key={index}>
                                <WishCard vinyl={vinyl}/>
                            </Col>
                        ))}

                        {wishlist.length === 0 && (
                        <div className="text-center my-3">
                            <h6 className="py-3">There are no vinyl records in the list</h6>
                        </div>
                        )}
                    </Row>               
                </>
                )}              
            </Container>
        <Footer/>
        </>
    )
}