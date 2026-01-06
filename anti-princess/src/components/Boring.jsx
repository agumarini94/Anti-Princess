import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom'; // Importamos para la navegación personalizada

function Boring() {
    //EXTRAIGO LAS TASK, DE LA NUBE
    const { tasks } = useContext(TaskContext);
    const navigate = useNavigate(); // Hook para navegar

    const [selectTasks, setSelectTasks] = useState([]);
    const [checked, setChecked] = useState([false, false]);
    const [canChange, setCanChange] = useState(true); // Estado para permitir cambiar una sola vez

    const getTwoRandomTasks = () => {
        if (tasks.length < 2) return;
        let n1 = Math.floor(Math.random() * tasks.length);
        let n2;
        do {
            n2 = Math.floor(Math.random() * tasks.length);
        } while (n2 === n1);
        setSelectTasks([tasks[n1], tasks[n2]]);
        setChecked([false, false]);
    };

    //esto hace que cuando aparezcan las 2 tareas, el componente elije 2 ..
    useEffect(() => {
        getTwoRandomTasks();
    }, [tasks]);

    const handleCheck = (index) => {
        const newChecked = [...checked];
        newChecked[index] = !newChecked[index];
        setChecked(newChecked);
    }

    // Función para cambiar las tareas (solo una vez)
    const handleChangeOnce = () => {
        if (canChange) {
            getTwoRandomTasks();
            setCanChange(false);
        }
    };

    // Función especial para el botón de volver
    const handleGoBack = () => {
        const done = window.confirm("Did you finish the activity?");
        if (done) {
            navigate('/'); // Si dice que sí, vuelve al inicio
        } else {
            alert("So continue with the activity !!");
            // Si dice que no, no hace nada (se queda en la página)
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3>Try to do this:</h3>

            <div className="menu-container" style={{ width: '100%', maxWidth: '500px' }}>
                {selectTasks.map((task, index) => (
                    <div
                        key={task.id}
                        className="menu-button"
                        style={{
                            height: 'auto',
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            cursor: 'default'
                        }}
                    >
                        <span style={{ flex: 1, textAlign: 'left' }}>{task.text}</span>
                        <input
                            type="checkbox"
                            style={{ width: '25px', height: '25px', cursor: 'pointer' }}
                            checked={checked[index]}
                            onChange={() => handleCheck(index)}
                        />
                    </div>
                ))}
            </div>

            {/* Botón para cambiar solo una vez */}
            {canChange ? (
                <button className="menu-button" onClick={handleChangeOnce} style={{ width: '300px', backgroundColor: '#333' }}>
                    CHANGE (ONLY ONCE) 🔄
                </button>
            ) : (
                <p style={{ color: 'gray' }}>No more changes allowed</p>
            )}

            {/* Botón de volver con la lógica de confirmación */}
            <button
                onClick={handleGoBack}
                style={{ marginTop: '40px', fontSize: '20px', cursor: 'pointer', padding: '10px 20px' }}
            >
                Go back to IndexPage
            </button>
        </div>
    );
}

export default Boring;