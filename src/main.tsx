import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './store/store.ts'
import { Provider } from 'react-redux'
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
        theme="dark"
      />
    </Provider>
  </StrictMode>,
)
