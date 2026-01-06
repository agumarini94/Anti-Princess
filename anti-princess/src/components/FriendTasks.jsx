import React, { useState } from "react";
//creo desafios aleatorios que ya esten cargados .
const PRESET_FRIENDS_CHALLENGES = [
    { id: 'f1', name: "Group Run 5km", penalty: 20 },
    { id: 'f2', name: "Weekend Digital Detox", penalty: 50 },
    { id: 'f3', name: "No Junk Food for 7 days", penalty: 30 }
];

export default function FriendsTasks() {
    //muestro los botones iniciales, list es la lista fija, y create, empieza el formulario para crear el desafio
    const [view, setView] = useState('menu');
    //aca guardo los valores del formulario de creacion 
    const [formData, setFormData] = useState({
        name: '', // Campo para el nombre del desafio
        description: '', // Campo para la descripcion
        players: 2,
        days: 1,
        entryFee: 10,
        winners: 1
    });

    //funcion para controlar los cambios en el formulario 
    const handleChange = (e) => {
        const { name, value } = e.target;
        //esto actualiza el campo que cambio manteniendo los otros 
        setFormData({ ...formData, [name]: value })
    };


    return (
        <div className="container">
            <h2>Challenge for Not Princess </h2>
            {/* PASO1 MENU PRINCIPAL DE AMIGOS */}
            {view === 'menu' && (
                <div className="menu-container">
                    <button className="menu-button" onClick={() => setView('list')}>
                        See our Challenges
                    </button>
                    <button className="menu-button" onClick={() => setView('create')}>
                        Create Challenge
                    </button>
                </div>
            )}
            {/* PASO 2 VER LISTA DE DESAFIOS YA CREADOS */}

            {view === 'list' && (
                <div>
                    <h3>Our Challenges</h3>
                    {PRESET_FRIENDS_CHALLENGES.map(c => (
                        <div key={c.id} className="active-contract" style={{ marginBottom: '10px', padding: '10px', border: '1px solid red' }}>
                            <strong>{c.name}</strong> - Penalty: ${c.penalty}
                        </div>
                    ))}
                    <button className="btn-secondary" onClick={() => setView('menu')}>Back</button>
                </div>
            )}

            {/* FORMULARIO PARA CREAR EL DESAFIO  */}
            {view === 'create' && (
                <div className="setup-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3>Configure Group Bet</h3>

                    {/* NUEVO: Input para crear el nombre del desafio */}
                    <label>Challenge Name:</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Ex: No sugar for a week"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    {/* NUEVO: Textbox para escribir la descripcion del desafio */}
                    <label>Description:</label>
                    <textarea
                        name="description"
                        placeholder="Write the rules here..."
                        style={{ padding: '10px', borderRadius: '8px', background: '#222', color: 'white', border: '1px solid #444', minHeight: '80px' }}
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <label>How many princess?</label>
                    <input name="players" type="number" value={formData.players} onChange={handleChange} />

                    <label>How many days to complete?</label>
                    <input name="days" type="number" value={formData.days} onChange={handleChange} />

                    <label>Money each one pays ($):</label>
                    <input name="entryFee" type="number" value={formData.entryFee} onChange={handleChange} />

                    <label>Number of winners:</label>
                    <select name="winners" value={formData.winners} onChange={handleChange}>
                        <option value="1">Only 1 (Winner takes all)</option>
                        <option value="2">Top 2</option>
                        <option value="3">Top 3 (Podium)</option>
                    </select>
                    <br />
                    {/* El botón de START es el que en el futuro enviará los datos al BACKEND */}
                    <button onClick={() => {
                        console.log("Datos para enviar a Neon:", formData);
                        alert("Group Challenge Created!");
                    }}>
                        START COMPETITION
                    </button>
                    <button className="btn-secondary" onClick={() => setView('menu')}>Cancel</button>
                </div>
            )}
        </div>
    );
}