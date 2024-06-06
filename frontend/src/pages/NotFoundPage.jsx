import notFound from "../components/_logo/notfound.png"
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFound () {

    const navigate = useNavigate()

    return (
        <>
        <div className="not-found-container">
            <div className="image-container">
                <img src={notFound} alt="Turntable" className="turntable-image" />
            </div>
            <h1 className="fs-2">Oops! Page not found!</h1>
            <p className="fs-4">It looks like the record you're looking for is missing!</p>
            <button onClick={() => navigate("/")} className="btn-padding btn-violet">
                Back to Homepage
            </button>
        </div>
        </>
    )
}