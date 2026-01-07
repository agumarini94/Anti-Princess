import React, { useState, useEffect } from 'react'; // Quitamos useContext para evitar conflictos
import axios from 'axios';

export default function Tasks({ user }) {
    // 1. Usamos estado local para manejar las tareas de este usuario
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');

    // IMPORTANTE: Si no hay usuario, mostramos un mensaje simple para que el ErrorBoundary no explote
    if (!user) {
        return <div style={{ color: 'white' }}>Loading user data...</div>;
    }

    // 2. CARGAR TAREAS (Fijas y del Usuario)
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Pedimos las tareas usando el ID del usuario logueado
                const res = await axios.get(`http://localhost:3005/tasks/${user.id}`);
                setTasks(res.data);
            } catch (error) {
                console.error("Error al obtener tareas", error);
            }
        };

        fetchTasks();
    }, [user.id]); // Solo se ejecuta cuando el ID del usuario cambia

    // Captura lo que escribes
    const handleAddingTask = (event) => {
        setInputValue(event.target.value);
    }

    // ENVIAR A LA BD 
    const handleAddTask = async () => {
        if (inputValue.trim() !== '') {
            try {
                const res = await axios.post('http://localhost:3005/tasks', {
                    text: inputValue,
                    completed: false,
                    userId: user.id
                });

                // Agregamos la nueva tarea a la lista local
                setTasks([...tasks, res.data]);
                setInputValue('');
            } catch (error) {
                console.error("Not possible to save the task", error);
            }
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>ADDING TASKS FOR ANTI-PRINC@SS</h1>

            <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder='Write a task'
                    style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #444',
                        background: '#1e1e1e',
                        color: 'white',
                        width: '250px'
                    }}
                    value={inputValue}
                    onChange={handleAddingTask} />
                <button
                    onClick={handleAddTask}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Add New Task
                </button>
            </div>

            <div className="menu-container" style={{ width: '100%', maxWidth: '500px' }}>
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="menu-button"
                        style={{
                            height: 'auto',
                            minHeight: '60px',
                            padding: '15px',
                            marginBottom: '10px',
                            cursor: 'default',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <span>{task.text}</span>
                        {/* Indicador de si es privada o global */}
                        <span style={{ fontSize: '10px', opacity: 0.5 }}>
                            {task.user_id ? '🔒' : '🌍'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}