import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'

import { GameWrapper } from './components/GameWrapper.tsx'

import './globals.scss'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <GameWrapper />
    <Analytics />
  </React.StrictMode>
)
