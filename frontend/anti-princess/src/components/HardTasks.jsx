import React, { useState } from "react";

// Defino los retos disponibles
const HARD_CHALLENGES = [
    { id: 'run', name: "Run 30 minutes", penalty: 50 },
    { id: 'gym', name: "Go to the Gym", penalty: 40 },
    { id: 'study', name: "Study React 1h", penalty: 30 },
    { id: 'eat', name: "Not eat sugar", penalty: 40 },
    { id: 'goOut', name: "Spend 30 minutes outside", penalty: 35 }
];

export default function HardTasks() {
    // Estados
    const [isLocked, setIsLocked] = useState(false);
    const [targetONG, setTargetONG] = useState('MyPartner');
    // Estado para saber qué desafío eligió el usuario del select
    const [selectedChallengeId, setSelectedChallengeId] = useState(HARD_CHALLENGES[0].id);
    const [completedTasks, setCompletedTasks] = useState({});

    // Buscamos los datos del desafío seleccionado para mostrarlos fácilmente
    const currentChallenge = HARD_CHALLENGES.find(c => c.id === selectedChallengeId);

    // Funciones
    const handleUpload = (id, e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setCompletedTasks({
                ...completedTasks,
                [id]: imageUrl
            });
        }
    };

    const resetDemo = () => {
        Object.values(completedTasks).forEach(url => URL.revokeObjectURL(url));
        setIsLocked(false);
        setCompletedTasks({});
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>HARDCORE MOOD: DO IT OR PAY</h2>
            <p style={{ maxWidth: '600px' }}>You make the rules.
                You set the challenge.

                If you do it — you win.
                If you don’t — you pay (by donating to an NGO).

                No excuses. No rewards.
                Just discipline, consequences, and self-respect.

                This is not a charity app.
It’s a motivation tool — and the pressure is the point. </p>

            {!isLocked ? (
                /* --- PASO 1: SELECCIÓN --- */
                <div className="menu-container" style={{ width: '100%', maxWidth: '600px' }}>
                    <div className="menu-button" style={{ height: 'auto', padding: '30px', flexDirection: 'column', gap: '15px', cursor: 'default' }}>
                        <h3>Contract :</h3>

                        <div style={{ width: '100%', textAlign: 'left' }}>
                            <p>2. Select your Challenge:</p>
                            <select
                                style={{ width: '100%', padding: '10px', background: '#222', color: 'white' }}
                                value={selectedChallengeId}
                                onChange={(e) => setSelectedChallengeId(e.target.value)}
                            >
                                {HARD_CHALLENGES.map(challenge => (
                                    <option key={challenge.id} value={challenge.id}>
                                        {challenge.name} (${challenge.penalty})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ width: '100%', textAlign: 'left' }}>
                            <p>1. Select who gets your money only if u fail:</p>
                            <select
                                style={{ width: '100%', padding: '10px', background: '#222', color: 'white' }}
                                value={targetONG}
                                onChange={(e) => setTargetONG(e.target.value)}
                            >
                                <option value="MyPartner">MyPartner</option>
                                <option value="Greenpeace">Greenpeace</option>
                                <option value="Apple">Apple</option>
                                <option value="Donald Trump">Donald Trump</option>
                            </select>
                        </div>

                        <div style={{ width: '100%', textAlign: 'left' }}>
                            <p>Dates card (simulated)</p>
                            <input
                                type='text'
                                placeholder="0000 0000 0000 0000"
                                disabled
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                            />
                        </div>

                        <button className="menu-button" style={{ height: '50px', marginTop: '10px', border: '2px solid red' }} onClick={() => setIsLocked(true)}>
                            Activate Contract
                        </button>
                    </div>
                </div>
            ) : (
                /* --- PASO 2: EL DESAFÍO ACTIVO --- */
                <div className="menu-container" style={{ width: '100%', maxWidth: '600px' }}>
                    <div className="menu-button" style={{ height: 'auto', minHeight: '350px', padding: '20px', flexDirection: 'column', border: '2px solid red', cursor: 'default' }}>
                        <h3>Contract activated with {targetONG}</h3>
                        <h4>Target: {currentChallenge.name}</h4>
                        <p>Penalty if fail: ${currentChallenge.penalty}</p>

                        {!completedTasks[selectedChallengeId] ? (
                            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <label style={{ cursor: 'pointer', color: '#646cff', fontWeight: 'bold', fontSize: '20px', border: '1px dashed #646cff', padding: '15px' }}>
                                    📸 ADD PHOTO
                                    <input
                                        type='file'
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleUpload(selectedChallengeId, e)}
                                    />
                                </label>

                                <button className="menu-button" style={{ height: '50px', color: 'red', border: '1px solid red' }} onClick={() => alert(`Mult sent it to ${targetONG}`)}>
                                    I didn't do :(
                                </button>
                            </div>
                        ) : (
                            <div style={{ marginTop: '20px' }}>
                                <p style={{ color: 'green', fontWeight: 'bold', fontSize: '22px' }}>Challenge completed!</p>
                                <img
                                    src={completedTasks[selectedChallengeId]}
                                    alt='Evidencia'
                                    style={{ width: '200px', borderRadius: '10px', border: '2px solid green', marginTop: '10px' }}
                                />
                            </div>
                        )}
                    </div>

                    <button className="btn-secondary" style={{ marginTop: '20px' }} onClick={resetDemo}>
                        Restart Demo
                    </button>
                </div>
            )}
        </div>
    );
}