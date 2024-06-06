import { Form } from "react-bootstrap";
import { useContext, useState } from 'react';
import { AuthContext } from '../../authorizations/AuthContext';
import Alert from '../../components/_alert/Alert';

export default function AddVinyl ({onNewVinyl, setShowAddVinyl}) {

    const { currentUser } = useContext(AuthContext); 

    //stati per spinner e alert:
    const [alert, setAlert] = useState(null);

    //stati input per nuovo vinile:
    const [vinylTitle, setVinylTitle] = useState("");
    const [vinylArtist, setVinylArtist] = useState("");
    const [vinylFormat, setVinylFormat] = useState("");
    const [vinylGenre, setVinylGenre] = useState("");
    const [vinylCountry, setVinylCountry] = useState("");
    const [vinylYear, setVinylYear] = useState(0);
    const [vinylLabel, setVinylLabel] = useState("");
    const [vinylCondition, setVinylCondition] = useState("");
    const [vinylPhotos, setVinylPhotos] = useState([]);
    const [vinylDescription, setVinylDescription] = useState("");
    const [vinylVisibility, setVinylVisibility] = useState("false");

    //reset fields:
    const resetForm = () => {
        setVinylTitle("");
        setVinylArtist("");
        setVinylFormat("");
        setVinylGenre("");
        setVinylCountry("");
        setVinylYear(0);
        setVinylLabel("");
        setVinylCondition("");
        setVinylDescription("");
        setVinylVisibility(false)
    };

    //raccolta dati:
    const handleNewVinyl = (e) => {
        e.preventDefault();

        if(!vinylTitle || !vinylArtist || !vinylFormat || !vinylGenre || !vinylCountry || !vinylYear || 
            !vinylLabel || !vinylCondition || !vinylPhotos || !vinylDescription || !vinylVisibility ) {
                setAlert({ message: "All fields are required, please check them and again!", type: "error" })  
        } else {
            const vinylData = {
                _user: currentUser._id,
                title: vinylTitle,
                artist: vinylArtist,
                format: vinylFormat,
                genre: vinylGenre,
                countryOfRel: vinylCountry,
                yearOfRel: parseInt(vinylYear, 10),
                label: vinylLabel,
                condition: vinylCondition,
                photos: vinylPhotos,
                description: vinylDescription,
                isPublic: vinylVisibility === "true",
            }
            onNewVinyl(vinylData);
            setShowAddVinyl(false);
        }
    }

    return (
        <>
        <Form className="px-5 mb-4">

            <Form.Group controlId="vinylTitle" className="mt-3">
                    <Form.Label>Album Title</Form.Label>
                    <Form.Control type="text"
                        placeholder="Enter full album title (e.g., Dark Side of the Moon)" className='input-bord'
                        value={vinylTitle} onChange={(e) => setVinylTitle(e.target.value)}
                    />
            </Form.Group>

            <Form.Group controlId="vinylArtist" className="mt-3">
                    <Form.Label>Artist or Band</Form.Label>
                    <Form.Control type="text"
                        placeholder="Enter full artist or band name (e.g., Pink Floyd)" className='input-bord'
                        value={vinylArtist} onChange={(e) => setVinylArtist(e.target.value)}
                    />
            </Form.Group>

            <Form.Group controlId="vinylFormat" className="mt-3">
                    <Form.Label>Vinyl Format</Form.Label>
                    <Form.Control as="select" className='input-bord'
                        value={vinylFormat} onChange={(e) => setVinylFormat(e.target.value)}
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
                        value={vinylGenre} onChange={(e) => setVinylGenre(e.target.value)}>
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
                        value={vinylCountry} onChange={(e) => setVinylCountry(e.target.value)}
                    />
            </Form.Group>

            <Form.Group controlId="vinylYearOfRel" className="mt-3">
                    <Form.Label>Year of Release</Form.Label>
                    <Form.Control type="number" 
                        placeholder="Enter year of release (e.g., 1971)" className='input-bord'
                        value={vinylYear} onChange={(e) => setVinylYear(e.target.value)}
                    />
            </Form.Group>

            <Form.Group controlId="vinylLabel" className="mt-3">
                    <Form.Label>Label</Form.Label>
                    <Form.Control type="text"  
                        placeholder="Enter record label (e.g., Capitol Records, Atlantic Records)" className='input-bord'
                        value={vinylLabel} onChange={(e) => setVinylLabel(e.target.value)}
                    />
            </Form.Group>

            <Form.Group controlId="vinylCondition" className="mt-3">
                    <Form.Label>Condition</Form.Label>
                    <Form.Control as="select" className='input-bord'
                        value={vinylCondition} onChange={(e) => setVinylCondition(e.target.value)}
                        >
                        <option>*based on Goldmine's grading scale</option>
                        <option value=" Mint (M) - Perfect condition, no flaws (unblemished cover, glossy vinyl, pristine labels)">
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
                            Fair (F) - Unusable condition, no cover or cover without vinyl
                        </option>
                    </Form.Control>
            </Form.Group>

            <Form.Group controlId="vinylPhotos" className="mt-3">
                    <Form.Label>Photos (min 1 - max 3)</Form.Label>
                    <Form.Control type="file" name="photos" className='input-bord' multiple
                     onChange={(e) => setVinylPhotos(Array.from(e.target.files))}
                    />
            </Form.Group>

            <Form.Group controlId="vinylDescription" className="mt-3">
                    <Form.Label>Description </Form.Label>
                    <Form.Control as="textarea" placeholder="Enter a brief yet comprehensive description of the vinyl, including: additional details about its condition, format, special features..." 
                        className='input-bord'
                        value={vinylDescription} onChange={(e) => setVinylDescription(e.target.value)}
                    />
            </Form.Group>

            <Form.Group controlId="isPublic" className="mt-3">
            <Form.Label>Do you want to publish your vinyl for other collectors?</Form.Label>
                <div>
                    <Form.Check type="radio" label="Yes" 
                    name="isPublic" value={"true"} id="isPublicTrue" inline
                    onChange={() => setVinylVisibility("true")}
                        />
                    <Form.Check type="radio" label="Not yet" 
                    name="isPublic" value={"false"} id="isPublicFalse" inline
                    onChange={() => setVinylVisibility("false")}
                        />
                </div>
            </Form.Group>

            <Form.Group className="d-flex mt-3 justify-content-end gap-3">
                <button type="reset" className='btn-white btn-padding' onClick={resetForm}>
                    Reset
                </button>

                <button type="submit" className='btn-padding btn-modify' onClick={handleNewVinyl}>
                    Save
                </button>
            </Form.Group>
        </Form>
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        </>
    )
}