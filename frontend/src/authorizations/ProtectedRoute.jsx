import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import LoaderBars from "../components/_loaders/LoaderBars";

export default function ProtectedRoute ({ role }) {

  const { authToken, currentUser, authenticated, loadingUserInfo } = useContext(AuthContext);

  //necessario per evitare che l'utente non autorizzato acceda alla pagina prima del controllo del ruolo:
  if (loadingUserInfo) {
    return <LoaderBars/> 
  }

  if (!authToken || !authenticated) {
    return <Navigate to="/login" />;
  }

  if (role && currentUser?.role && currentUser.role !== role) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};