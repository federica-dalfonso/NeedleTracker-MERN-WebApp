import { createContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthContextProvider ({children}) {

    //token
    const [ authToken, setAuthToken ] = useState(sessionStorage.getItem("token") || "" );
    //stato autenticazione per protezione rotte:
    const [authenticated, setAuthenticated] = useState(authToken !== "");
    //stato info utente + stato loading:
    const [ loadingUserInfo, setLoadingUserInfo ] = useState(false);
    const [ currentUser, setCurrentUser ] = useState(null);

    //redirect
    const navigate = useNavigate();

    //aggiornamento autenticazione e get currentUser data:
    useEffect(() => {
        setAuthenticated(authToken !== "");
        if (authToken) {
            fetchUserInfo(authToken);
        }
    }, [authToken]);

    //fetch /me:
    const fetchUserInfo = async (authToken) => {
        setLoadingUserInfo(true);
        try {
            const response = await fetch('http://localhost:3003/me', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if(response.ok) {
                const data = await response.json();
                setCurrentUser(data);
                setLoadingUserInfo(false);
                return data;              

            } else {
                console.error(`Error in response: ${response.status} ${response.statusText}`)
            }            
        } catch (error) {
            console.error("Failed to fetch:", error);
        }
    };

    //login e salvataggio token:
    const login = async (token) => {
        setAuthToken(token);
        sessionStorage.setItem("token", token);
        const user = await fetchUserInfo(token);
        setAuthenticated(true);  

        if (user.role === "collector") {
            navigate("/tracker");
        } else if (user.role === "author") {
            navigate("/authorsarea");
        }
    };

    //logout ed eliminazione token:
    const logout = () => {
        setAuthToken("");
        sessionStorage.removeItem('token');
        setAuthenticated(false);
        setCurrentUser(null)
        navigate('/');
    }

    //aggiornamento userInfo in caso di put dati: 
    const updateUserInfo = (updatedInfo) => {
        setCurrentUser(updatedInfo);
    };


    const value = { authToken, authenticated, currentUser, updateUserInfo, loadingUserInfo, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}