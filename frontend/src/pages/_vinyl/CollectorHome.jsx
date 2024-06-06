import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../authorizations/AuthContext";
import LoaderBars from "../../components/_loaders/LoaderBars";
import Alert from "../../components/_alert/Alert.jsx";
import SpinnerOver from "../../components/_loaders/SpinnerOver";
import NavbarApp from "../../components/_headers/NavbarApp";
import VinylSearch from "../../components/_vinylsarea/VinylSearch";
import HandleList from "../../components/_vinylsarea/HandleList";
import Footer from "../../components/_footer/Footer"

export default function CollectorHome () {

    //stato spinner e alert:
    const [ spin, setSpin ] = useState(false);
    const [bar, setBar ] = useState(false);
    const [alert, setAlert] = useState(null);

    const { authToken, currentUser } = useContext(AuthContext);
    const [ vinylist, setVinylist ] = useState([]);
    const [ searchResult, setSearchResult ] = useState([]);

    //get lista vinili:
    const getVinylist = async () => {
        setBar(true)
        try {
            const response = await fetch(`http://localhost:3003/tracker/vinyls`, {
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            })
            if(response.ok) {
                const listData = await response.json();
                console.log(listData)
                const filteredVinylist = listData.filter(vinyl => vinyl._user[0]._id !== currentUser._id);
                setVinylist(filteredVinylist);
            } else {
                console.error(`Error in response: ${response.status} ${response.statusText}`);
                setAlert({ message: `An error occurred: ${response.statusText}`, type: "error" });
            }
        } catch (error) {
            console.error("Request failed:", error);
            setAlert({ message: "We're sorry! An error occurred while processing your request, please try again later.", type: "error" });
        } finally {
            setBar(false)
        }
    }

    useEffect(() => {
        if (currentUser && currentUser._id) {
            getVinylist();
        }        
    }, [currentUser])

    //ricerca vinili:
    const handleSearchVinyl = async (keywords) => {
        setSpin(true);
        try {
            const query = new URLSearchParams(keywords).toString();
            const response = await fetch(`http://localhost:3003/tracker/vinyls/search?${query}`, {
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if(response.ok) {
                const vinylResults = await response.json();
                setSearchResult(vinylResults);
            } else {
                console.error(`Error in response: ${response.status} ${response.statusText}`);
                setAlert({ message: `An error occurred: ${response.statusText}`, type: "error" });
            }
        } catch (error) {
            console.error("Request failed:", error);
            setAlert({ message: "We're sorry! An error occurred while processing your request, please try again later.", type: "error" });
        } finally {
            setSpin(false)
        }}
    

    return (
        <>        
        <NavbarApp userInfo={currentUser}/>
        <VinylSearch onSearch={handleSearchVinyl}/>
        {bar ? <LoaderBars/> : <HandleList vinylist={vinylist} searchResult={searchResult}/>}    
        <Footer/>
        {spin && <SpinnerOver/>}    
        </>
    )
    
}