import React, { useState, useEffect } from 'react';

export default function UserAntiPrinc() {
    const [userObj, setUserObj] = useState('')// guardo el obj del user, que proviene del primer input .
    const [minutes, setMinutes] = useState(0); //guardo el tiempo que el usuario eligio para cumplir el reto 
    const [timeLeft, setTimeLeft] = useState(0) //es el tiempo que falta hasta cumplir el reto
    const [isActive, setIsActive] = useState(false) //verifica si empezo el objetivo. Viene del boton Start objetivo
    const [isFinished, setIsFinished] = useState(false); //terimna el proceso, libera el isntagram.. 

    //para el temporizador
    useEffect(() => {
        let interval = null;
        //si el user start obj, time more that 0, and not finish
        if (isActive && timeLeft > 0 && !isFinished) {
            interval = setInterval(() => {//start the time
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive && !isFinished) {
            clearInterval(interval);// para que no siga bajando el tiempo a -1, -2 , -3, en 0 lanza el alerta. 
            alert('you didnt finish on time');
        } //return, termina el tiempo e inicia uno nuevo cuando lo use de vuelta. 
        return () => clearInterval(interval);
    }, [isActive, timeLeft, isFinished]);

    //function to start the obj
    const startObj = () => {
        if (!userObj || minutes <= 0) {
            alert("write a validate time and obj")
            return;
        }
        setTimeLeft(minutes * 60);
        setIsActive(true);
        setIsFinished(false);
    };

    //esta funcion maneja el bloqueo de instagram 
    const handleInstagramClick = (e) => {
        // BLOQUEO: Si el reto está activo pero NO ha terminado
        if (isActive && !isFinished) {
            e.preventDefault();
            alert("🚫 YOU CANT. \nFIRST U NEED TO FINISH YOUR OBJ " + userObj);
        } else {
            // LIBRE: Si no hay reto o ya terminó, abre Instagram
            window.open("https://www.instagram.com", "_blank");
        }
    };

    //formatear el timer // para que no siga funcionando una vez terminado el tiempo
    const formatTime = () => {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };


    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Task user Anti Princess</h1>

            {!isActive ? (
                <div className="menu-container" style={{ width: '100%', maxWidth: '600px' }}>
                    {/* Cuadro grande para la configuración inicial */}
                    <div className="menu-button" style={{ height: 'auto', padding: '30px', flexDirection: 'column', gap: '15px' }}>
                        <input type='text' placeholder='challenge?'
                            style={{ width: '80%', padding: '10px' }}
                            value={userObj} onChange={(e) => setUserObj(e.target.value)}
                        />
                        <input type='number' placeholder='Time?'
                            style={{ width: '80%', padding: '10px' }}
                            onChange={(e) => setMinutes(parseInt(e.target.value))}
                        />
                        <button className="menu-button" style={{ height: '50px', width: '200px' }} onClick={startObj}>
                            Start Challenge
                        </button>
                    </div>
                </div>
            ) : (
                <div className="menu-container" style={{ width: '100%', maxWidth: '600px' }}>
                    {/* Cuadro gigante para el Temporizador y el Estado */}
                    <div className="menu-button" style={{ height: 'auto', minHeight: '300px', padding: '20px', flexDirection: 'column', cursor: 'default' }}>
                        <h3>
                            {isFinished ? "Congratulatios" : 'Working on'}
                        </h3>

                        {/* El tiempo en números bien grandes */}
                        <div style={{ fontSize: '100px', fontWeight: 'bold', margin: '20px 0' }}>
                            {formatTime()}
                        </div>

                        <p style={{ fontSize: '20px' }}><strong>Task: </strong>{userObj}</p>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            {!isFinished && (
                                <button onClick={() => setIsFinished(true)}>
                                    I did it
                                </button>
                            )}
                            <button onClick={() => { setIsActive(false); setUserObj(''); }}>
                                Cancel and start again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <hr style={{ width: '100%', margin: '30px 0', borderColor: '#333' }} />

            {/* Cuadro de Instagram Grande */}
            <div className="menu-container" style={{ width: '100%', maxWidth: '600px' }}>
                <button
                    className="menu-button"
                    onClick={handleInstagramClick}
                    style={{
                        height: '120px',
                        fontSize: '24px',
                        border: (isActive && !isFinished) ? '2px solid red' : '2px solid #E1306C'
                    }}
                >
                    {isActive && isFinished ? "Instagram Block " : "Go to instagram"}
                </button>
            </div>
        </div>
    );
}