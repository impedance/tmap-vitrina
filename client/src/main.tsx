import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TelegramProvider } from './components/TelegramProvider'
import { CartProvider } from './store/CartStore'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TelegramProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </TelegramProvider>
  </React.StrictMode>,
)


