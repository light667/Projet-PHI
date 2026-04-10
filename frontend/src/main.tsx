import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'
import './index.css'
import './i18n.js'
import { ThemeProvider } from './components/ThemeProvider.js'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="phi-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
)
