import { FcGoogle } from "react-icons/fc";

export default function GoogleLogin () {

    const handleGoogleLogin = (e) => {
        e.preventDefault();
        const str = "http://localhost:3003/access/googleLogin";
        window.open(str, "_self");
    }

    return(
        <>
        <button className='btn-padding btn-white w-50 d-flex justify-content-center align-items-center gap-1 my-2' onClick={handleGoogleLogin}>
            login with <FcGoogle className="fs-5"/>
        </button>
        </>
    )
}