import React, { useState, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext';
import './App.css';
import Tasks from './components/Tasks';
import Boring from './components/Boring';
import UserAntiPrinc from './components/UserAntiPrinc';
import ErrorBoundary from './components/ErrorBoundary';
import PrincessMode from './components/PrincessMode';
import HardTasks from './components/HardTasks';
import FriendsTasks from './components/FriendTasks';
import CouplesTasks from './components/CoupleTasks';
import Login from './components/Login';

function App() {
  // 1. Forzamos el usuario inicial para que no sea null
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();
  const { bgColor, setBgColor, textColor, setTextColor } = useContext(ThemeContext);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{
      backgroundColor: bgColor,
      color: textColor,
      minHeight: '100vh',
      width: '100vw',
      transition: '0.3s',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>

      {/* --- ELIMINAMOS/COMENTAMOS LA CONDICIÓN DEL LOGIN PARA ENTRAR DIRECTO --- */}
      {!user ? (
        <Login onLoginSuccess={(userData) => setUser(userData)} />
      ) : (
        <>
          {/* BARRA DE USUARIO LOGUEADO */}
          <div style={{ alignSelf: 'flex-end', padding: '10px 30px', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span>Welcome, <strong>{user?.username}</strong></span>
            <button onClick={handleLogout} style={{ background: '#ff4444', border: 'none', color: 'white', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer' }}>
              Logout
            </button>
          </div>

          {/* SECTOR DE CONFIGURACIÓN DE COLORES */}
          <div style={{
            border: '1px solid #444',
            padding: '10px 20px',
            marginBottom: '20px',
            marginTop: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            backgroundColor: 'rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Background:</label>
              <input type="text" placeholder="ej: black" onChange={(e) => setBgColor(e.target.value)} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', outline: 'none', width: '100px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>LetterColor:</label>
              <input type="text" placeholder="ej: yellow" onChange={(e) => setTextColor(e.target.value)} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #666', color: 'white', outline: 'none', width: '100px' }} />
            </div>
          </div>

          <h1>Anti - Princess 🚫👑</h1>

          <div style={{
            maxWidth: '600px',
            margin: '0 auto 30px auto',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '15px',
            borderLeft: '4px solid red',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#ccc', fontStyle: 'italic' }}>
              Bored or stuck? This app is built to **push you into action.**
            </p>
          </div>

          <ErrorBoundary>
            <Routes>
              <Route path='/' element={
                <div className="menu-container">
                  <button className="menu-button" onClick={() => navigate('/boring')}>Im boring what can i do ?🔋</button>
                  <button className="menu-button" onClick={() => navigate('/user')}>Create your Anti-Pricess 😎</button>
                  <button className="menu-button" onClick={() => navigate('/coupleTasks')}>Create Tasks for couples</button>
                  <button className="menu-button" onClick={() => navigate('/groupPrincess')}>Challenge for group of princess</button>
                  <button className="menu-button" onClick={() => navigate('/hardTasks')}>Do a very hard Task🔥</button>
                  <button className="menu-button" onClick={() => navigate('/admin')}>Add more tasks 💪🏻</button>
                  <button className="menu-button" onClick={() => navigate('/princess')}>I want to be a Princess 👑✨</button>
                </div>
              } />

              <Route path="/boring" element={<Boring user={user} />} />
              <Route path='/user' element={<UserAntiPrinc />} />
              <Route path='/admin' element={<Tasks user={user} />} />
              <Route path="/princess" element={<PrincessMode />} />
              <Route path='/hardTasks' element={<HardTasks />} />
              <Route path='/groupPrincess' element={<FriendsTasks user={user} />} />
              <Route path='/coupleTasks' element={<CouplesTasks />} />
            </Routes>
          </ErrorBoundary>

          <button onClick={() => navigate('/')} style={{ marginTop: '40px', fontSize: '20px', cursor: 'pointer', background: 'transparent', color: 'inherit', border: '1px solid #444', padding: '10px 20px', borderRadius: '8px' }}>
            Go back to IndexPage
          </button>
        </>
      )}
    </div>
  );
}

export default App;