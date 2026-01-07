import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { TaskProvider } from './context/TaskContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
//Agrego un router para poder navegar en las pestanas segun su enlace. 
createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <TaskProvider>
      <BrowserRouter> 
        <App />
      </BrowserRouter>
      </TaskProvider>
  </ThemeProvider>,
)
