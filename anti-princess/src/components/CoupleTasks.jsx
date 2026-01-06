import React, { useState } from "react";

// Lista de desafíos románticos (Sweet & Romantic)
const ROMANTIC_CHALLENGES = [
    { id: 'r1', name: "Romantic Dinner Date", description: "Organize a dinner without phones.", penalty: 20 },
    { id: 'r2', name: "Love Letter Exchange", description: "Write and exchange handwritten letters.", penalty: 10 },
    { id: 'r3', name: "Sunset Walk", description: "Walk together during sunset for 30 min.", penalty: 15 },
    { id: 'r4', name: "Breakfast in Bed", description: "Surprise your partner with breakfast tomorrow morning.", penalty: 12 },
    { id: 'r5', name: "Do yoga together", description: "Start to do yoga together for 30 minutes", penalty: 15 }
];

// Lista de desafíos no románticos (Home & Practical)
const PRACTICAL_CHALLENGES = [
    { id: 'p1', name: "Laundry War", description: "Whoever loses must fold all the laundry.", penalty: 30 },
    { id: 'p2', name: "Chef Challenge", description: "Cook a 3-course meal for the other.", penalty: 40 },
    { id: 'p3', name: "Deep Clean Session", description: "Clean the bathroom or kitchen together.", penalty: 50 },
    { id: 'p4', name: "Grocery Run Solo", description: "Go and buy everything for the week alone.", penalty: 25 },
    { id: 'p5', name: "Clean dishes", description: "Its your turn to clean the dishes", penalty: 35 }
];

export default function CouplesTasks() {
    // ESTADOS: view (menu/display), currentTask (la tarea elegida), canChange (permite un cambio)
    const [view, setView] = useState('menu');
    const [currentTask, setCurrentTask] = useState(null);
    const [canChange, setCanChange] = useState(true);
    const [mode, setMode] = useState(''); // Para saber si es romantic o no-romantic

    // Función para obtener una tarea aleatoria de la lista
    const getRandomTask = (type) => {
        const list = type === 'romantic' ? ROMANTIC_CHALLENGES : PRACTICAL_CHALLENGES;
        const randomIndex = Math.floor(Math.random() * list.length);
        setCurrentTask(list[randomIndex]);
        setMode(type);
        setView('display');
    };

    // Función para cambiar la tarea (solo una vez)
    const handleChangeTask = () => {
        if (canChange) {
            const list = mode === 'romantic' ? ROMANTIC_CHALLENGES : PRACTICAL_CHALLENGES;
            // Filtramos la tarea actual para que no vuelva a salir la misma
            const filteredList = list.filter(t => t.id !== currentTask.id);
            const randomIndex = Math.floor(Math.random() * filteredList.length);
            setCurrentTask(filteredList[randomIndex]);
            setCanChange(false); // Bloqueamos futuros cambios
        }
    };

    return (
        <div className="container">
            <h2>Couples Challenges 💖</h2>

            {/* VISTA 1: Menú con los 2 botones principales */}
            {view === 'menu' && (
                <div className="menu-container">
                    <button className="menu-button" onClick={() => getRandomTask('romantic')}>
                        Get Random Romantic Task ✨
                    </button>
                    <button className="menu-button" onClick={() => getRandomTask('practical')}>
                        Get No-Romantic Task 🧹
                    </button>
                </div>
            )}

            {/* VISTA 2: Pantalla de la tarea obtenida */}
            {view === 'display' && currentTask && (
                <div className="setup-section" style={{ textAlign: 'center' }}>
                    <div className="active-contract" style={{
                        marginBottom: '20px',
                        padding: '20px',
                        border: mode === 'romantic' ? '2px solid #ff4d6d' : '2px solid #6c757d'
                    }}>
                        <h3>{currentTask.name}</h3>
                        <p>{currentTask.description}</p>
                        <p><strong>Penalty: ${currentTask.penalty}</strong></p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button className="menu-button" onClick={() => alert("Task Accepted!")}>
                            ACCEPT CHALLENGE
                        </button>

                        {/* Botón de cambio: Se deshabilita después de un uso */}
                        {canChange ? (
                            <button className="menu-button" style={{ backgroundColor: '#444' }} onClick={handleChangeTask}>
                                CHANGE (ONLY ONCE) 🔄
                            </button>
                        ) : (
                            <p style={{ color: 'gray', fontSize: '14px' }}>No more changes available</p>
                        )}

                        <button className="btn-secondary" onClick={() => {
                            setView('menu');
                            setCanChange(true); // Reseteamos el permiso para la próxima vez
                        }}>
                            Back to Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}