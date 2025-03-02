import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AlertProvider } from './contexts/AlertContext'
import { PatientProvider } from './contexts/PatientContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PatientProvider>
    <AlertProvider>
    <App />
    </AlertProvider>
    </PatientProvider>
  </StrictMode>,
)
