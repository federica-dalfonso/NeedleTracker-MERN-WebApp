import "./VinylCard.css";
import { Card } from 'react-bootstrap';
import { useLocation, Link } from "react-router-dom";
import ModifyVinyl from "./ModifyVinyl";
import { FaTrash } from 'react-icons/fa';
import { GoHeartFill, GoHeart } from "react-icons/go";
import { MdOutlinePublic, MdOutlinePublicOff } from "react-icons/md";

export default function WishCard({ vinyl }) {

    const { _album } = vinyl;


    const location = useLocation();

    return (
      <>
        <Card className="rounded-0 pos-rel">
            <div className="image-container">
                <div className="image-square">
                    <Card.Img variant="top" src={_album.photos[0]} className="card-image rounded-0" />
                </div>  
            </div>                  

            <Card.Body className="text-center pt-0">

                <div className="d-flex justify-content-end mb-2">
                    <button className="btn-wishlist">
                        <GoHeartFill />
                    </button>
                </div>  
            
                <Card.Title>
                    <h5 className="ellipsis-title">{_album.title}</h5>
                    <h6>{_album.artist}</h6>
                </Card.Title>
                <Card.Text>
                    {_album.countryOfRel} - {_album.yearOfRel}
                </Card.Text>
            </Card.Body>

            <Card.Footer className="d-flex justify-content-center align-items-center gap-3 border-0">
                <Link to={`/tracker/details/:${_album._id}`}><button className="btn-padding btn-violet">details</button></Link>
            </Card.Footer>
        </Card>
      </>
    );
}