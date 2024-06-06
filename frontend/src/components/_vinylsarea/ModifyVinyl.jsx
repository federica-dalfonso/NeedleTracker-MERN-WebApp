import { Form, Row, Col, Modal } from "react-bootstrap";
import { useState, useContext } from "react";
import { AuthContext } from "../../authorizations/AuthContext";
import Alert from "../_alert/Alert";
import SpinnerOver from "../_loaders/SpinnerOver";

export default function ModifyVinyl({vinyl, convertFileToUrl, setPersonalVinylist}) {

    const { authToken, currentUser } = useContext(AuthContext);

    //stati per spinner e alert:
    const [alert, setAlert] = useState(null);
    const [spin, setSpin] = useState(false);

    // gestione modale
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //destrutturazione vinile da modificare:
    const { title, artist, format, genre, countryOfRel, yearOfRel, label, condition, photos, description, isPublic, _id } = vinyl;

    //stati modifica info:
    const [modifyPhotos, setModifyPhotos] = useState([]);
    const [modifyTitle, setModifyTitle] = useState(title);
    const [modifyArtist, setModifyArtist] = useState(artist);
    const [modifyFormat, setModifyFormat] = useState(format);
    const [modifyGenre, setModifyGenre] = useState(genre);
    const [modifyCountryOfRel, setModifyCountryOfRel] = useState(countryOfRel);
    const [modifyYearOfRel, setModifyYearOfRel] = useState(yearOfRel);
    const [modifyLabel, setModifyLabel] = useState(label);
    const [modifyCondition, setModifyCondition] = useState(condition);
    const [modifyDescription, setModifyDescription] = useState(description);

    //raccolta dati modificati:
    const handleSubmitChanges = (e) => {
        e.preventDefault();

        const putVinylData = {
            _id: _id,
            title: modifyTitle,
            artist: modifyArtist,
            format: modifyFormat,
            genre: modifyGenre,
            countryOfRel: modifyCountryOfRel,
            yearOfRel: parseInt(modifyYearOfRel, 10),
            label: modifyLabel,
            condition: modifyCondition,
            photos: modifyPhotos.length > 0 ? modifyPhotos : photos,
            description: modifyDescription, 
            isPublic: isPublic,       
        }
        putVinylInfo(putVinylData)
    }

    //modifica informazioni del vinile:
    const putVinylInfo = async (putVinylData) => {
        setSpin(true)
        try {
            //upload immagini se vengono caricate:
            if(modifyPhotos.length > 0) {
                let result = await convertFileToUrl({files: putVinylData.photos, field: "photos", isMultiple: true}, 
                "http://localhost:3003/tracker/vinyl/photos", authToken);
                putVinylData.photos = result.photosUrls;
            }

            const response = await fetch(`http://localhost:3003/tracker/vinyl/${putVinylData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                    "Authorization": `Bearer ${authToken}`,
                },
                body: JSON.stringify(putVinylData)
            });
            if(response.ok) {
                const vinylInfoModified = await response.json();
                setPersonalVinylist(prevVinyls => prevVinyls.map(vinyl => 
                    vinyl._id === vinylInfoModified._id ? vinylInfoModified : vinyl
                ))
                setAlert({ message: "Vinyl successfully modified", type: "success" })
            } else {
                setAlert({ message: `An error occurred: ${response.statusText}`, type: "error" })
                console.error(`Error in response: ${response.status} ${response.statusText}`)
            }            
        } catch (error) {
            console.error("Request failed:", error)
        } finally {
            setSpin(false)
        }
    }

    return (
        <>
        <button className="btn-padding btn-modify" onClick={handleShow}>
            Modify
        </button>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} id="modify-vinyl" >
                <Modal.Header closeButton>
                    <Modal.Title>Modify Vinyl</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="px-5 mb-4">
                        <Row>
                            <Col xs={12}>
                                <div className="d-flex align-items-center gap-3 w-100">
                                    {photos && photos.map((image, index) => (
                                        <img className='preview-article-img-size mx-2' key={index} src={image} alt="Anteprima immagini vinile" />
                                    ))}
                                    <Form.Group controlId="vinylPhotos" className="mt-3 w-100">
                                        <Form.Label>Photos (min 1 - max 3)</Form.Label>
                                        <Form.Control type="file" name="photos" className='input-bord' multiple
                                            onChange={(e) => setModifyPhotos(Array.from(e.target.files))}
                                        />
                                    </Form.Group>
                                </div>
                            </Col>

                            <Col xs={12}>
                                <Form.Group controlId="vinylTitle" className="mt-3">
                                    <Form.Label>Album Title</Form.Label>
                                    <Form.Control type="text"
                                        placeholder="Enter full album title (e.g., Dark Side of the Moon)" className='input-bord'
                                        value={modifyTitle} onChange={(e) => setModifyTitle(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="vinylArtist" className="mt-3">
                                    <Form.Label>Artist or Band</Form.Label>
                                    <Form.Control type="text"
                                        placeholder="Enter full artist or band name (e.g., Pink Floyd)" className='input-bord'
                                        value={modifyArtist} onChange={(e) => setModifyArtist(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="vinylFormat" className="mt-3">
                                    <Form.Label>Vinyl Format</Form.Label>
                                    <Form.Control as="select" className='input-bord'
                                        value={modifyFormat} onChange={(e) => setModifyFormat(e.target.value)}
                                    >
                                        <option>Select a format</option>
                                        <option value="7-inch single (45 RPM)">7-inch single (45 RPM)</option>
                                        <option value="10-inch EP (33⅓ RPM)">10-inch EP (33⅓ RPM)</option>
                                        <option value="12-inch LP (Long Play) (33⅓ RPM)">12-inch LP (Long Play) (33⅓ RPM)</option>
                                        <option value="10-inch LP (33⅓ RPM)">10-inch LP (33⅓ RPM)</option>
                                        <option value="Test pressing (varies)">Test pressing (varies)</option>
                                        <option value="Colored vinyl (varies)">Colored vinyl (varies)</option>
                                        <option value="Box set (varies)">Box set (varies)</option>
                                        <option value="Limited edition (varies)">Limited edition (varies)</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="vinylGenre" className="mt-3">
                                    <Form.Label>Genre</Form.Label>
                                    <Form.Control as="select" className='input-bord'
                                        value={modifyGenre} onChange={(e) => setModifyGenre(e.target.value)}
                                    >
                                        <option>Select a music genre</option>
                                        <option value="Rock">Rock</option>
                                        <option value="Jazz">Jazz</option>
                                        <option value="Blues">Blues</option>
                                        <option value="Soul / R&B">Soul / R&B</option>
                                        <option value="Reggae">Reggae</option>
                                        <option value="Hip Hop / Rap">Hip Hop / Rap</option>
                                        <option value="Folk / Bluegrass">Folk / Bluegrass</option>
                                        <option value="Punk / Hardcore">Punk / Hardcore</option>
                                        <option value="World / Global">World / Global</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="vinylCountryOfRel" className="mt-3">
                                    <Form.Label>Country of Release</Form.Label>
                                    <Form.Control type="text"
                                        placeholder="Enter country of release (e.g., USA, UK, Japan)" className='input-bord'
                                        value={modifyCountryOfRel} onChange={(e) => setModifyCountryOfRel(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="vinylYearOfRel" className="mt-3">
                                    <Form.Label>Year of Release</Form.Label>
                                    <Form.Control type="number"
                                        placeholder="Enter year of release (e.g., 1971)" className='input-bord'
                                        value={modifyYearOfRel} onChange={(e) => setModifyYearOfRel(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="vinylLabel" className="mt-3">
                                    <Form.Label>Label</Form.Label>
                                    <Form.Control type="text"
                                        placeholder="Enter record label (e.g., Capitol Records, Atlantic Records)" className='input-bord'
                                        value={modifyLabel} onChange={(e) => setModifyLabel(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="vinylCondition" className="mt-3">
                                    <Form.Label>Condition</Form.Label>
                                    <Form.Control as="select" className='input-bord'
                                        value={modifyCondition} onChange={(e) => setModifyCondition(e.target.value)}
                                    >
                                        <option>*based on Goldmine's grading scale</option>
                                        <option value="Mint (M) - Perfect condition, no flaws (unblemished cover, glossy vinyl, pristine labels)">
                                            Mint (M) - Perfect condition, no flaws (unblemished cover, glossy vinyl, pristine labels)
                                        </option>
                                        <option value="Near Mint (NM) - Excellent condition with all original pieces (uncreased cover, shiny vinyl, flawless labels)">
                                            Near Mint (NM) - Excellent condition with all original pieces (uncreased cover, shiny vinyl, flawless labels)
                                        </option>
                                        <option value="Very Good Plus (VG+) - Slight signs of use, minimal impact on quality">
                                            Very Good Plus (VG+) - Slight signs of use, minimal impact on quality
                                        </option>
                                        <option value="Very Good (VG) - Signs of use or handling, audible surface noise">
                                            Very Good (VG) - Signs of use or handling, audible surface noise
                                        </option>
                                        <option value="Very Good Minus (VG-) - Significant signs of use, scratches, ring wear, or broken spine">
                                            Very Good Minus (VG-) - Significant signs of use, scratches, ring wear, or broken spine
                                        </option>
                                        <option value="Fair (F) - Unusable condition, no cover or cover without vinyl">
                                            Fair (F) - Unusable condition, no cover or cover without vinyl)
                                        </option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col xs={12}>
                                <Form.Group controlId="vinylDescription" className="mt-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" placeholder="Enter a brief yet comprehensive description of the vinyl, including: additional details about its condition, format, special features..."
                                        className='input-bord'
                                        value={modifyDescription} onChange={(e) => setModifyDescription(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Form.Group className="d-flex mt-4 justify-content-end gap-3">
                                <button className='btn-white btn-padding' onClick={handleClose}>
                                    close
                                </button>
                                <button type="submit" className='btn-padding btn-modify' onClick={handleSubmitChanges}>
                                    Save changes
                                </button>
                            </Form.Group>
                        </Row>
                    </Form>
                </Modal.Body>
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            {spin && <SpinnerOver />}    
            </Modal>    

        </>
    )
}