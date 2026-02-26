import React from 'react'
import ReactDOM from 'react-dom/client'
import { initTelegramAdapter } from './utils/telegramAdapter'
import App from './App.tsx'
import './index.css'
import { TelegramProvider } from './components/TelegramProvider'
import { CartProvider } from './store/CartStore'

// Initialize the mock Telegram environment BEFORE rendering.
// This seeds the SDK's internal state in browser mode, so that
// TelegramProvider's init() call doesn't throw LaunchParamsRetrieveError.
initTelegramAdapter()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TelegramProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </TelegramProvider>
  </React.StrictMode>,
)
