// src/main.tsx
import 'bootstrap/dist/css/bootstrap.min.css'  // ← Bootstrap goes first
import './index.css'                           // ← Your overrides come next
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
