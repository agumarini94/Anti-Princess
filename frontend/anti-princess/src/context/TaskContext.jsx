import React, { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    // 1. Ahora getTasks es una función que podemos llamar cuando el usuario se loguea
    const getTasks = async (userId) => {
        if (!userId) return; // Si no hay ID, no pedimos nada
        try {
            // URL corregida para que coincida con el servidor: /tasks/:userId
            const response = await axios.get(`http://localhost:3005/tasks/${userId}`);
            setTasks(response.data);
        } catch (error) {
            console.error("Error cargando tareas de Neon:", error);
        }
    };

    // 2. Función para agregar tareas con el ID del dueño
    const addTask = async (text, userId) => {
        try {
            const response = await axios.post('http://localhost:3005/tasks', {
                text,
                completed: false,
                userId: userId // <--- IMPORTANTE: Pasamos el dueño al servidor
            });
            setTasks([...tasks, response.data]);
        } catch (error) {
            console.error("Error al guardar tarea:", error);
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, getTasks }}>
            {children}
        </TaskContext.Provider>
    );
};






/**El useContext sirve principalmente para limpiar el desorden y evitar un problema llamado "Prop Drilling" (pasar datos a través de componentes que no los necesitan solo para que lleguen a uno que está más abajo). 
 * El useContext sirve principalmente para limpiar el desorden y evitar un problema llamado "Prop Drilling" (pasar datos a través de componentes que no los necesitan solo para que lleguen a uno que está más abajo).

Aquí te doy 3 razones clave de por qué te sirve en tu proyecto:

1. Evitas el "Teléfono Descompuesto" (Prop Drilling)
Imagina que tienes esta estructura: App -> Layout -> Pestaña -> Boring. Sin Context, tienes que pasar tasks por todos esos niveles, aunque Layout y Pestaña no usen las tareas para nada. Con Context, App guarda las tareas en "la nube" y Boring las baja directamente cuando las necesita.

2. Sincronización automática en tiempo real
Si tuvieras dos pantallas abiertas al mismo tiempo o componentes diferentes:

En la sección Admin, agregas una tarea nueva.

En la sección Boring, esa tarea aparece al instante. Al estar todos conectados a la misma "nube" (el Contexto), no tienes que preocuparte por actualizar cada componente por separado. Todos ven lo mismo siempre.

3. Código mucho más limpio en App.jsx
Tu archivo App.jsx ahora está cargado de lógica: estados de tareas, funciones para borrar, funciones para agregar... Al usar useContext, mueves toda esa lógica a un archivo aparte (TaskContext.jsx). Tu App.jsx solo se encarga de las rutas y de mostrar la interfaz, haciéndolo mucho más fácil de leer y mantener.

Ejemplo real en tu App:
Imagina que quieres guardar el nombre de usuario para saludarlo en todas las pantallas.

Sin Context: Tienes que pasar username como prop a cada botón, a cada componente y a cada ruta.

Con Context: Creas un UserContext. En la pantalla de inicio pones tu nombre, y luego en UserAntiPrinc.jsx simplemente haces const { name } = useContext(UserContext) y ¡listo!, ya lo tienes disponible.
*/


// CONECTED TO THE POSTMAN YA NO NECESITO ESTO PORUQE LO TOMO DIRECTAMENTE DE LA BD <----- * 

// const [tasks, setTasks] = useState([
//     { id: 1, text: "Go for a run", completed: false },
//     { id: 2, text: "Read 10 pages", completed: false },
//     { id: 3, text: "Clean your room", completed: false },
//     { id: 4, text: "Study React for 30 minutes", completed: false },
//     { id: 5, text: "Go to swim", completed: false },
// ]);