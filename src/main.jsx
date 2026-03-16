import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('app'))
root.render(
  <App />
)
