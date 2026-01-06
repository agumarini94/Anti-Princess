import React from 'react'
import { useState, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';

export default function Tasks() {  //Con esto recibo los task desde la nube directamente. 

    const { tasks, setTasks } = useContext(TaskContext);

    const [inputValue, setInputValue] = useState(''); //<-- esto es para lo que escribo en el input

    const handleAddingTask = (event) => { //this is to capture what is writing
        setInputValue(event.target.value);
    }
    //this function is to add task to the list "tasks"
    const addTask = () => {//this is to create a new task
        if (inputValue.trim() !== '') {
            // CALCULO EL ID AQUÍ AFUERA
            const nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

            const newTaskObj = {
                id: nextId, // uso el ID calculado
                text: inputValue,
                completed: false
            };//agrego la nueva tarea a la lista vacia. SETTASKS ES LA FUNCION QUE LO AGREGA
            setTasks([...tasks, newTaskObj]);
        }
        setInputValue(''); //esto limpia el input , para que quede en blanco y volver a escribir
    }
    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>ADDING TASKS FOR ANTI-PRINC@SS</h1>

            {/* Sección de Input con estilo mejorado */}
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
                    onClick={addTask}
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

            {/* Lista renderizada con el estilo de rectángulos del menú */}
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
                            cursor: 'default' // Quitamos el puntero de click ya que es solo lista
                        }}
                    >
                        {task.text}
                    </div>
                ))}
            </div>
        </div>
    );
}