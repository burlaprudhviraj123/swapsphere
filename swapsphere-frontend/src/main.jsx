import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RADIUS } from './theme/radius.js'
import './index.css'
import App from './App.jsx'

for (const [key, value] of Object.entries(RADIUS)) {
  document.documentElement.style.setProperty(`--radius-${key}`, `${value}px`)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
