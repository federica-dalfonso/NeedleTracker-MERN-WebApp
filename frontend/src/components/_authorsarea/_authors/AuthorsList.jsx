import React, { useEffect, useContext } from "react";
import { AuthContext } from '../../../authorizations/AuthContext';
import { ListGroup } from "react-bootstrap";
import DeleteAuthor from "./DeleteAuthor";
import {Badge} from "react-bootstrap";

export default function AuthorsList({ getAllAuthors, allAuthors, setAllAuthors }) {


    const { currentUser } = useContext(AuthContext);     

    //richiamo la funzione per ottenere la lista autori al montaggio del componente:
    useEffect(() => {
        getAllAuthors();
    }, [allAuthors]);

    return (
        <>
        <div>
            <h4 className="my-4 admin-title">Our authors</h4>
            <ListGroup variant="flush">
                {allAuthors && allAuthors.length > 0 &&
                allAuthors.map((single, index) => (
                    <ListGroup.Item
                        key={index}
                        className={`d-flex align-items-center justify-content-between ${single._id === currentUser._id ? 'bg-light' : ''}`}
                        >
                        <span>{single.name} {single.surname}</span>
                        {single._id === currentUser._id && <Badge className="rounded-0 bg-violet text-uppercase">You</Badge>}
                        {single._id !== currentUser._id && (
                            <div className="d-flex gap-3">
                                <DeleteAuthor author={single} allAuthors={allAuthors} setAllAuthors={setAllAuthors}/>
                            </div>
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>           
        </div>
        </>
    );
}
