import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../authorizations/AuthContext";
import SpinnerOver from "../../components/_loaders/SpinnerOver"


export default function LoadingWelcome() {

    const { login } = useContext(AuthContext);

    const toLoginAgain = useNavigate();

    const handleGoogleLoginResponse = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenValue = urlParams.get("accessToken");

        if(tokenValue) {
            login(tokenValue)
        } else {
            toLoginAgain("/login");
        }
    }

    useEffect(() => {
        handleGoogleLoginResponse();
    }, [])

    return (
        <>
        <SpinnerOver/>
        </>
    )
}