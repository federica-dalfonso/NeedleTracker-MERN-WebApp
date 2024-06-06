import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ArticleCard ({article}) {

    const {cover, resume, title, _id} = article;

    return (
        <>
        
        <Card className="rounded-0">
                <div className="image-container">
                    <div className="image-square">
                        <Card.Img variant="top" src={cover} className='card-image rounded-0' />
                    </div>
                </div>
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="fs-5">{title}</Card.Title>
                    <Card.Text className="summary">
                        {resume}
                    </Card.Text>

                    <div className="align-self-end read-more">
                        <Link to={`/:${_id}`} className="card-linked">
                            <button className="btn-padding btn-violet">read more</button> 
                        </Link>
                    </div>
                </Card.Body>                
            </Card>
        </>
    )
}