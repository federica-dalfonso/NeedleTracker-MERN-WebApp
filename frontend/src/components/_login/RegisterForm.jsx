import { Form, FloatingLabel } from "react-bootstrap";
import { useState } from "react";
import Alert from "../_alert/Alert";
import SpinnerOver from "../_loaders/SpinnerOver";

export default function RegisterForm ({convertFile, setShowLogin}) {

    //stati per spinner e alert:
    const [alert, setAlert] = useState(null);
    const [spin, setSpin] = useState(false);

    //gestione stati campi di registrazione:
    const [ regName, setRegName ] = useState("");
    const [ regSurname, setRegSurname ] = useState("");
    const [ regUsername, setRegUsername ] = useState(""); 
    const [ regEmail, setRegEmail ] = useState("");
    const [ regPassword, setRegPassword ] = useState("");
    const [ regAvatar, setRegAvatar ] = useState("");
    const [ regCity, setRegCity ] = useState("");
    const [ regState, setRegState ] = useState("");

    //raccolta dati:
    const handleRegData = (e) => {
        e.preventDefault();

        //controllo compilazione campi obbligatori: 
        if(!regName || !regSurname || !regUsername || !regEmail || !regPassword || !regAvatar || !regCity || !regState) {
            setAlert({ message: "All fields are required. Please complete each one to continue!", type: "error" })
        } else if (regPassword.length < 8) {
            setAlert({ message: "Please ensure your password is at least 8 characters long for better security!", type: "notify" });
        } else {

            const regUserData = {
                name: regName,
                surname: regSurname,
                username: regUsername,
                email: regEmail,
                password: regPassword,
                avatar: regAvatar,
                city: regCity,
                state: regState,
                role: "collector"
            }
            signinFn(regUserData)
        }       
    }

    //reset fields:
    const resetForm = () => {
        setRegName("");
        setRegSurname("");
        setRegUsername(""); 
        setRegEmail("");
        setRegPassword("");
        setRegAvatar(null);
        setRegCity("");
        setRegState("");
    }

    //fetch post nuovo utente:
    const signinFn = async (regUserData) => {
        setSpin(true);
        try {
            //upload file avatar:
            let userAvatar = await convertFile({files: regUserData.avatar, field: "avatar", isMultiple: false},
            "http://localhost:3003/access/avatar");
            regUserData.avatar = userAvatar.avatarUrl;

            const response = await fetch(`http://localhost:3003/access/signin`,  {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(regUserData)
            });
            if(response.ok) {
                const userSignedIn = await response.json();
                setAlert({ message: "Registration completed successfully!", type: "success" })
                resetForm();
                setTimeout(() => {
                    setShowLogin(true)
                }, 2000);                
            } else {
                console.error(`Error in response: ${response.status} ${response.statusText}`)
                setAlert({ message: `We're sorry, an error occurred: ${response.statusText}`, type: "error" })
            }            
        } catch (error) {
            console.error("Request failed:", error)
        } finally {
            setSpin(false);
        }
    }    
   
    return (
        <>
        <Form onSubmit={handleRegData}>
            <Form.Group controlId="formBasicName" className='mb-2' autoComplete="on">
                <FloatingLabel controlId="floatingName"
                label="Name">
                    <Form.Control className='input-bord'
                        type="text" 
                        autoComplete="given-name"
                        value={regName} 
                        onChange={(e) => setRegName(e.target.value)} 
                    />
                </FloatingLabel>
            </Form.Group>

            <Form.Group controlId="formBasicSurname" className='mb-2'>
                <FloatingLabel controlId="floatingSurname"
                label="Surname">
                    <Form.Control className='input-bord'
                        type="text" 
                        autoComplete="family-name"
                        value={regSurname} 
                        onChange={(e) => setRegSurname(e.target.value)} 
                    />
                </FloatingLabel>
            </Form.Group>

            <Form.Group controlId="formBasicUsername" className='mb-2'>
                <FloatingLabel controlId="floatingUsername"
                label="Username">
                    <Form.Control className='input-bord'
                        type="text" 
                        autoComplete="username"
                        value={regUsername} 
                        onChange={(e) => setRegUsername(e.target.value)} 
                    />
                </FloatingLabel>
            </Form.Group>

            <Form.Group controlId="formBasicEmail" className='mb-2'>
                <FloatingLabel controlId="floatingEmail"
                label="Email">
                    <Form.Control className='input-bord'
                        type="email" 
                        autoComplete="email"
                        value={regEmail} 
                        onChange={(e) => setRegEmail(e.target.value)} 
                    />
                </FloatingLabel>
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className='mb-2'>
                <FloatingLabel controlId="floatingPassword"
                label="Password">
                    <Form.Control className='input-bord'
                        type="password" 
                        autoComplete="new-password"
                        value={regPassword} 
                        onChange={(e) => setRegPassword(e.target.value)} 
                    />
                </FloatingLabel>
            </Form.Group>

            <Form.Group controlId="formBasicAvatar" className='mb-2'>
                <FloatingLabel controlId="floatingAvatar"
                label="Avatar">
                    <Form.Control className='input-bord'
                        type="file" 
                        name="avatar" 
                        onChange={(e) => setRegAvatar(e.target.files[0])} 
                    />
                </FloatingLabel>
            </Form.Group>

            <Form.Group controlId="formBasicCity" className='mb-2'>
                <FloatingLabel controlId="floatingCity"
                label="City">
                    <Form.Control className='input-bord'
                        type="text" 
                        autoComplete="city"
                        value={regCity} 
                        onChange={(e) => setRegCity(e.target.value)} 
                    />
                </FloatingLabel>
            </Form.Group>

            <Form.Group controlId="formBasicState" className='mb-2'>
                <FloatingLabel controlId="floatingState"
                label="State">
                    <Form.Control className='input-bord'
                        type="text" 
                        autoComplete="state"
                        value={regState} 
                        onChange={(e) => setRegState(e.target.value)} 
                    />
                </FloatingLabel>
            </Form.Group>

            <div className='d-flex flex-column align-items-center'>
                <button type="submit" className='btn-padding btn-violet mt-4'>
                    register
                </button> 
            </div>
            
        </Form>
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        {spin && <SpinnerOver />}
        </>
    )
}