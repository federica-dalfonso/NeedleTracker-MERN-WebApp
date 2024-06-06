import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthContextProvider from './authorizations/AuthContext';
import ProtectedRoute from './authorizations/ProtectedRoute';
import Magazine from './pages/_free/Magazine';
import NotFound from './pages/NotFoundPage';
import LoginPage from './pages/_free/LoginPage';
import LoadingWelcome from './pages/_free/LoadingWelcome';
import ArticlePage from './pages/_free/ArticlePage';
import AuthorDashboard from './pages/_magazine/AuthorDashboard';
import CollectorHome from "./pages/_vinyl/CollectorHome";
import MyTrackerPage from './pages/_vinyl/MyTrackerPage';
import VinylDetailPage from './pages/_vinyl/VinylDetailPage';
import WishlistPage from './pages/_vinyl/WishlistPage';
import CollectorProfilePage from './pages/_vinyl/CollectorProfilePage';

function App() {

  //funzione di upload dei files (upload singolo & multiplo)
  const convertFileToUrl = async ({files, field, isMultiple}, urlEndpoint, token = "") => { 
    try {
      const formData = new FormData();

      if (isMultiple) {
        //se l'upload è multiplo itero sul singolo file per assegnare il field required:
        files.forEach((file) => {
          formData.append(field, file);
        })
      } else {
        formData.append(field, files);
      };

      const options = {
        method: "POST",
        body: formData
      };

      if(token) {
        options.headers = {
          "Authorization": `Bearer ${token}`
        };
      };

      const response = await fetch(`${urlEndpoint}`, options);

      if(response.ok) {
        const urls = await response.json();
        return urls;
        
      } else {
        console.error(`An error occurred: ${response.status} ${response.statusText}`);
      }

    } catch (error) {
      console.error("Failed to fetch:", error);
    }       
  };   
  
  return (
    <>
    <BrowserRouter>
        <AuthContextProvider>          
            <Routes>
              <Route path='/' element={<Magazine/>} ></Route>
              <Route path='/:articleId' element={<ArticlePage/>}></Route>
              <Route path='/login' element={<LoginPage convertFile={convertFileToUrl}/>}></Route>
              <Route path='/welcome' element={<LoadingWelcome />}></Route>
              <Route path="*" element={<NotFound/>}></Route>
              <Route element={<ProtectedRoute role="author"/>}>
                <Route path='/authorsarea' element={<AuthorDashboard convertFile={convertFileToUrl}/>}></Route> 
              </Route>
              <Route element={<ProtectedRoute role="collector"/>}>
                <Route path='/tracker' element={<CollectorHome/>}></Route> 
                <Route path='/tracker/mydashboard' element={<MyTrackerPage convertFileToUrl={convertFileToUrl}/>} ></Route>
                <Route path='/tracker/details/:vinylId' element={<VinylDetailPage convertFileToUrl={convertFileToUrl}/>} ></Route>
                <Route path='/tracker/wishlist' element={<WishlistPage/>}></Route>
                <Route path='/tracker/profile' element={<CollectorProfilePage/>}></Route>
              </Route>
            </Routes>  
        </AuthContextProvider>  
    </BrowserRouter>
    </>
  );
}

export default App;
