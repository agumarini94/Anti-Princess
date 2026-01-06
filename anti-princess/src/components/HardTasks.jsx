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
    const [targetONG, setTargetONG] = useState('Greenpeace');
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
        <div>
            <h2>HARDCORE MOOD: DO IT OR PAY</h2>
            <p>Im trying to motivate you, you should start one challenge that is difficult for you, and in the end of the day, if u didnt finish it, you'll pay to some ONG a little money. But try to do the challenge ! </p>

            {!isLocked ? (
                /* --- PASO 1: SELECCIÓN --- */
                <div>
                    <h3>Contract :</h3>
                    <p>2. Select your Challenge:</p>
                    <select
                        value={selectedChallengeId}
                        onChange={(e) => setSelectedChallengeId(e.target.value)}
                    >
                        {HARD_CHALLENGES.map(challenge => (
                            <option key={challenge.id} value={challenge.id}>
                                {challenge.name} (${challenge.penalty})
                            </option>
                        ))}
                    </select>
                    <p>1. Select who gets your money only if u fail:</p>
                    <select value={targetONG} onChange={(e) => setTargetONG(e.target.value)}>
                        <option value="Greenpeace">Greenpeace</option>
                        <option value="Apple">Apple</option>
                        <option value="Donald Trump">Donald Trump</option>
                    </select>

                    <br />
                    <p>Dates card (simulated)</p>
                    <input type='text' placeholder="0000 0000 0000 0000" disabled />
                    <br /><br />

                    <button onClick={() => setIsLocked(true)}>
                        Activate Contract
                    </button>
                </div>
            ) : (
                /* --- PASO 2: EL DESAFÍO ACTIVO --- */
                <div>
                    <div style={{ border: '2px solid red', padding: '15px' }}>
                        <h3>Contract activated with {targetONG}</h3>
                        <h4>Target: {currentChallenge.name}</h4>
                        <p>Penalty if fail: ${currentChallenge.penalty}</p>

                        {!completedTasks[selectedChallengeId] ? (
                            <div>
                                <label style={{ cursor: 'pointer', color: 'blue', fontWeight: 'bold' }}>
                                    📸 ADD PHOTO
                                    <input
                                        type='file'
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleUpload(selectedChallengeId, e)}
                                    />
                                </label>
                                <br /><br />
                                <button onClick={() => alert(`Mult sent it to ${targetONG}`)}>
                                    I didn't do :(
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p style={{ color: 'green', fontWeight: 'bold' }}>Challenge completed!</p>
                                <img
                                    src={completedTasks[selectedChallengeId]}
                                    alt='Evidencia'
                                    width='150'
                                />
                            </div>
                        )}
                    </div>

                    <br />
                    <button onClick={resetDemo}>Restart Demo</button>
                </div>
            )}
        </div>
    );
}