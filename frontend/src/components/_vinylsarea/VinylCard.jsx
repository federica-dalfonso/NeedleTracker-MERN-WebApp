import "./VinylCard.css";
import { Card } from 'react-bootstrap';
import { useLocation, Link } from "react-router-dom";
import ModifyVinyl from "./ModifyVinyl";
import DeleteVinyl from "./DeleteVinyl";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { MdOutlinePublic, MdOutlinePublicOff } from "react-icons/md";

export default function VinylCard({ vinyl, isInWishlist, handleToggleWishlist, patchVinylInfo, convertFileToUrl, personalVinylist, setPersonalVinylist }) {

    const { photos, title, artist, yearOfRel, countryOfRel, isPublic, _user, _id} = vinyl;

    const location = useLocation();

    const handleWishlistClick = () => {
        handleToggleWishlist(vinyl);
    };

    const onPatch = () => {
        patchVinylInfo(vinyl._id, { isPublic : !isPublic})
    }

    return (
      <>
        <Card className="rounded-0 pos-rel">
            <div className="image-container">
                <div className="image-square">
                    <Card.Img variant="top" src={photos[0]} className="card-image rounded-0" />
                </div>  
            </div>                  

            <Card.Body className="text-center pt-0">

                <div className="d-flex justify-content-end mb-2">
                    <button onClick={handleWishlistClick} className={`btn-wishlist ${location.pathname === "/tracker" ? "" : "d-none"}`}>
                        {isInWishlist ? <GoHeartFill /> : <GoHeart />}
                    </button>
                    <button className={`btn-is-public ${location.pathname === "/tracker/mydashboard" ? "" : "d-none"}`}
                        onClick={onPatch}>
                        {isPublic ? <MdOutlinePublic className="color-green"/> : <MdOutlinePublicOff/> }
                    </button>
                </div>  
            
                <Card.Title>
                    <h5 className="ellipsis-title">{title}</h5>
                    <h6>{artist}</h6>
                </Card.Title>
                <Card.Text>
                    {countryOfRel} - {yearOfRel}
                </Card.Text>
            </Card.Body>

            <Card.Footer className="d-flex justify-content-center align-items-center gap-3 border-0">
                {location.pathname === "/tracker" &&<Link to={`/tracker/details/:${_id}`}><button className="btn-padding btn-violet">details</button></Link>}
                {location.pathname === "/tracker/mydashboard" && <ModifyVinyl vinyl={vinyl} convertFileToUrl={convertFileToUrl} setPersonalVinylist={setPersonalVinylist}/>}
                {location.pathname === "/tracker/mydashboard" && <DeleteVinyl vinyl={vinyl} personalVinylist={personalVinylist} setPersonalVinylist={setPersonalVinylist}/>}
            </Card.Footer>
        </Card>
      </>
    );
}