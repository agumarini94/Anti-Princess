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
function App() {
  const navigate = useNavigate();
  const { bgColor, setBgColor, textColor, setTextColor } = useContext(ThemeContext);

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
      <div style={{ border: '1px solid', padding: '10px', marginBottom: '20px', marginTop: '10px' }}>
        <label>Background Color: </label>
        <input
          type="text"
          placeholder="ej: black, red, #333"
          onChange={(e) => setBgColor(e.target.value)}
        />

        <label style={{ marginLeft: '10px' }}>LetterColor: </label>
        <input
          type="text"
          placeholder="ej: white, yellow"
          onChange={(e) => setTextColor(e.target.value)}
        />
      </div>
      <h1>Anti - Princess 🚫👑</h1>

      <ErrorBoundary>
        <Routes>
          <Route path='/' element={
            /* AQUÍ ESTÁ EL CAMBIO: El contenedor y las clases de los botones */
            <div className="menu-container">
              <button className="menu-button" onClick={() => navigate('/boring')}>Im boring what can i do ?🔋</button>
              <button className="menu-button" onClick={() => navigate('/user')}>Create your Anti-Pricess 😎</button>
              <button className="menu-button" onClick={() => navigate('/admin')}>Add more tasks 💪🏻</button>
              <button className="menu-button" onClick={() => navigate('/princess')}>I want to be a Princess 👑✨</button>
              <button className="menu-button" onClick={() => navigate('/hardTasks')}>DO A VERY HARD TASK🔥</button>
              <button className="menu-button" onClick={()=> navigate('/coupleTasks')}>Create Tasks for couples</button>
              <button className="menu-button" onClick={() => navigate('/groupPrincess')}>Challenge for group of princess</button>
            </div>
          } />

          <Route path="/boring" element={<Boring />} />
          <Route path='/user' element={<UserAntiPrinc />} />
          <Route path='/admin' element={<Tasks />} />
          <Route path="/princess" element={<PrincessMode />} />
          <Route path='hardTasks' element={<HardTasks />} />
          <Route path='groupPrincess' element={<FriendsTasks />} />
          <Route path='coupleTasks' element={<CouplesTasks />} />
        </Routes>
      </ErrorBoundary>

      <button onClick={() => navigate('/')} style={{ marginTop: '40px', fontSize: '20px', cursor: 'pointer' }}>
        Go back to IndexPage
      </button>
    </div>
  );
}

export default App;