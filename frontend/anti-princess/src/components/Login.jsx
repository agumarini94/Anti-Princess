import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
//esto es para saber si el usuario se esta registrando o logeando 
    const [isRegistrering, setIsRegistering] = useState(false); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        //la linea de abajo, dice --> endpoint vale register o login, depende lo que el usuario este haciendo, entonces en el http, va a ir a login o register...         
        const endpoint = isRegistrering ? 'register' : 'login';
        const userData = { email, password }; //Preparod los Datos basicos 
        //si es registro, le agrego el username
        if (isRegistrering) {
            userData.username = username; // <-- esto agrega el username del User table
        }

        try {
            const res = await axios.post(`http://localhost:3005/${endpoint}`,  userData); 
            if (isRegistrering) {
                alert('NewUser Registred ! ');
                setIsRegistering(false); // <-- esto me lleva de vuelta al modo login
            } else {
            // Guardamos el token en el navegador para que no se cierre la sesión al refrescar
            localStorage.setItem('token', res.data.token);
            // Avisamos a la App que ya entramos
                onLoginSuccess(res.data.user);
            }
        } catch (error) {
            alert(error.response?.data?.error || "error creando usuario");
        }
    };
   

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            {/* TITULO DINAMICO SEGUN SI ESTA INICIANDO O REGISTRANDO SE */}
            <h2>{isRegistrering ? 'CREATE ACCOUNT' : 'LOGGIN ON'}</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
                {/* CAMPO DE USERNAME SOLO SI SE ESTA REGISTRANDO */}
                {isRegistrering && (
                <input type='text' placeholder='Username' onChange={(e) => setUsername(e.target.value)} required />
                )} 
                {/* formulario si esta iniciando, pero si se esta registradno voy a ver los 3 inputs */}
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                {/* EL BOTON ES DINAMICO PARA INICIAR SESION, O REGISTRARSE */}
                <button type="submit">{isRegistrering ? 'Register' : 'Loggin'}
                </button>
            </form>
            {/* BOTON PARA CAMBIAR EL MODO A REGISTRO */}
            <button
                onClick={() => setIsRegistering(!isRegistrering)}
                style={{ marginTop: '20px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
            >
                {isRegistrering ? "Already have an account? Login" : "Don't have an account? Create one"}
            </button>
        </div>
    );
}