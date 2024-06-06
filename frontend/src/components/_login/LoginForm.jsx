import React, { useState } from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import GoogleLogin from './GoogleLogin';
import Alert from '../_alert/Alert';

export default function LoginForm ({isAuthor, setIsAuthor, onLogin}) {

    // state per dati di login:
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    //stati per spinner e alert:
    const [alert, setAlert] = useState(null);

    //raccolta input utente e invio dati alla fetch:
    const getDatafromLogin = (event) => {
        event.preventDefault();

        //controllo campi compilati
        if(!userEmail || !userPassword) {
            setAlert({ message: "All fields are required. Please complete each one to continue!", type: "error" })
        } else {
            const userData = {
                email: userEmail,
                password: userPassword
            };
            onLogin(userData)
        }
    }

    //passaggio ai vari form:
    const handleAuthorToggle = () => {
        setIsAuthor(!isAuthor);
    };

    return (   
        <>
        <div className="p-4">
            
            <div id='checkForm'>
                <Form.Check type="checkbox" label="I'm an author"
                    checked={isAuthor}
                    onChange={handleAuthorToggle}
                />
            </div>

            <Form>
                <Form.Group controlId="formBasicEmail" className='mb-2'>
                    <FloatingLabel controlId="floatingEmail"
                    label="Email address">
                        <Form.Control className='input-bord'
                            type="email" autoComplete="email"
                            value={userEmail} 
                            onChange={(e) => setUserEmail(e.target.value)} 
                             
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className='mb-2'>
                    <FloatingLabel controlId="floatingPassword"
                    label="Your password">
                        <Form.Control className='input-bord'
                            type="password" autoComplete="current-password"
                            value={userPassword} 
                            onChange={(e) => setUserPassword(e.target.value)} 
                             
                        />
                    </FloatingLabel>
                </Form.Group>

                
                <div className={`d-flex flex-column align-items-center mt-3 ${!isAuthor ? "visible" : "invisible"}`}>
                    <span>or</span>
                    <GoogleLogin/>
                </div>
                

                <div className='d-flex flex-column align-items-center'>
                   <button type="submit" className='btn-padding btn-violet mt-4' onClick={getDatafromLogin}>
                        confirm
                    </button> 
                </div>
                
            </Form>
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        </div>
        </> 
    );
}
