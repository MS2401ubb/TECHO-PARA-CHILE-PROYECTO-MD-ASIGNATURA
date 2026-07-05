import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/Home.jsx'
import './styles/style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
