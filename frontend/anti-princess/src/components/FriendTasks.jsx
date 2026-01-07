import React, { useState } from "react";
import axios from "axios";

const API_URL = `http://${window.location.hostname}:3005`;

const PRESET_FRIENDS_CHALLENGES = [
    { id: 'f1', name: "Group Run 5km", penalty: 20 },
    { id: 'f2', name: "Weekend Digital Detox", penalty: 50 },
    { id: 'f3', name: "No Junk Food for 7 days", penalty: 30 }
];

export default function FriendsTasks({ user }) {
    const [view, setView] = useState('menu');
    const [myChallenges, setMyChallenges] = useState([]);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [players, setPlayers] = useState([]);
    const [joinCode, setJoinCode] = useState(''); // --> Movido aquí para que funcione

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        players: 2,
        days: 1,
        entryFee: 10,
        winners: 1
    });

    const fetchMyChallenges = async () => {
        if (!user?.id) return alert("Please login first");
        try {
            const res = await axios.get(`${API_URL}/my-challenges/${user.id}`);
            setMyChallenges(res.data);
            setView('my_list');
        } catch (err) {
            alert("Error loading your challenges");
        }
    };

    // --- AQUÍ ESTABA EL ERROR DE LLAVES ---
    const handleViewDetails = async (challenge) => {
        setSelectedChallenge(challenge);
        try {
            const res = await axios.get(`${API_URL}/challenge-players/${challenge.id}`);
            setPlayers(res.data);
            setView('details');
        } catch (err) {
            console.error(err);
            alert("Error loading players");
        }
    };

    const handleSubmitProof = async () => {
        if (!user?.id) return;
        try {
            await axios.post(`${API_URL}/submit-proof`, {
                challenge_id: selectedChallenge.id,
                user_id: user.id
            });
            alert("¡Punto sumado! Sigue así.");
            handleViewDetails(selectedChallenge);
        } catch (err) {
            alert(err.response?.data?.error || "Error al enviar la prueba");
        }
    };

    const handleCreateChallenge = async () => {
        try {
            const res = await axios.post(`${API_URL}/challenges`, {
                name: formData.name,
                description: formData.description,
                princess: formData.players,
                days: formData.days,
                money: formData.entryFee,
                winners: formData.winners,
                creator_id: user?.id || 1
            });
            alert("Group Challenge Created! Share this code: " + res.data.join_code);
            setView('menu');
        } catch (err) {
            alert("Error creating challenge");
        }
    };

    const handleJoinChallenge = async () => {
        try {
            await axios.post(`${API_URL}/challenges/join`, {
                user_id: user?.id || 1,
                join_code: joinCode
            });
            alert("Joined successfully!");
            fetchMyChallenges();
        } catch (err) {
            alert("Invalid code or already joined");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    };

    return (
        <div className="container">
            <h2>Challenge for Not Princess </h2>

            {view === 'menu' && (
                <div className="menu-container">
                    <button className="menu-button" onClick={() => setView('list')}> See our Challenges </button>
                    <button className="menu-button" onClick={() => setView('create')}> Create Challenge </button>
                    <button className="menu-button" onClick={fetchMyChallenges}> My Challenges 🏆 </button>
                    <button className="menu-button" onClick={() => setView('join')}> Join with code </button>
                </div>
            )}

            {view === 'list' && (
                <div>
                    <h3>Our Suggested Challenges</h3>
                    {PRESET_FRIENDS_CHALLENGES.map(c => (
                        <div key={c.id} className="active-contract" style={{ marginBottom: '10px', padding: '10px', border: '1px solid red' }}>
                            <strong>{c.name}</strong> - Penalty: ${c.penalty}
                        </div>
                    ))}
                    <button className="btn-secondary" onClick={() => setView('menu')}>Back</button>
                </div>
            )}

            {view === 'my_list' && (
                <div>
                    <h3>My Groups </h3>
                    {myChallenges.length === 0 ? (
                        <p>You are not joined in any group</p>
                    ) : (
                        myChallenges.map(c => (
                            <div key={c.id} className="active-contract" style={{ marginBottom: '15px', padding: '15px', border: '2px solid #00ff00' }}>
                                <strong>{c.name}
                                    <p style={{ fontSize: '2em' }}>{c.description}</p>
                                    <div style={{ fontSize: '1em', marginTop: '10px' }}>
                                        💰 Pool: ${c.money * c.princess} | 🔑 Code: {c.join_code}
                                    </div>
                                </strong>
                                <button style={{ marginTop: '10px', width: '100%', padding: '5px' }} onClick={() => handleViewDetails(c)}>Upload Proof</button>
                            </div>
                        ))
                    )}
                    <button className="btn-secondary" onClick={() => setView('menu')}>Back</button>
                </div>
            )}

            {view === 'details' && selectedChallenge && (
                <div className="setup-section">
                    <h3>{selectedChallenge.name}</h3>
                    <p>{selectedChallenge.description}</p>
                    <div style={{ border: '1px solid #444', padding: '10px', borderRadius: '8px', margin: '20px 0' }}>
                        <h4>Group Ranking</h4>
                        {players.map((p, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px', borderBottom: '1px solid #222' }}>
                                <span>{p.username} {p.is_eliminated ? '❌' : '👑'}</span>
                                <strong>{p.points || 0} Pts</strong>
                            </div>
                        ))}
                    </div>
                    <div style={{ border: '1px dotted #00ff00', padding: '20px', borderRadius: '8px', margin: '20px 0', textAlign: 'center' }}>
                        <h4>Submit your proof</h4>
                        <input type="file" accept="image/*" capture="camera" style={{ marginBottom: '15px' }} />
                        <br />
                        <button onClick={handleSubmitProof}> Confirm Submission </button>
                    </div>
                    <button className="btn-secondary" onClick={() => setView('my_list')}> Back </button>
                </div>
            )}

            {view === 'create' && (
                <div className="setup-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3>Configure Group Bet</h3>
                    <label>Challenge Name:</label>
                    <input name="name" type="text" value={formData.name} onChange={handleChange} />
                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', background: '#222', color: 'white', minHeight: '80px' }} />
                    <label>How many princess?</label>
                    <input name="players" type="number" value={formData.players} onChange={handleChange} />
                    <label>Days:</label>
                    <input name="days" type="number" value={formData.days} onChange={handleChange} />
                    <label>Entry Fee ($):</label>
                    <input name="entryFee" type="number" value={formData.entryFee} onChange={handleChange} />
                    <button onClick={handleCreateChallenge}> START COMPETITION </button>
                    <button className="btn-secondary" onClick={() => setView('menu')}>Cancel</button>
                </div>
            )}

            {view === 'join' && (
                <div className="setup-section" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3>Join a Challenge</h3>
                    <input
                        type="text"
                        placeholder="Ex: AB1234"
                        style={{ textTransform: 'uppercase', padding: '10px' }}
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    />
                    <button onClick={handleJoinChallenge}> JOIN NOW </button>
                    <button className="btn-secondary" onClick={() => setView('menu')}>Back</button>
                </div>
            )}
        </div>
    );
}