import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter} from "react-router-dom";
import "./TanslateArEn/i18n.jsx";
import LanguageProvider from "./TanslateArEn/LanguageProvider.jsx";
import { SnackbarProvider } from "./contexts/SnackbarContext.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import './components/Style/animations.css';

createRoot(document.getElementById('root')).render(
  < BrowserRouter>
    <StrictMode>
        <AuthProvider>
        <LanguageProvider>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </LanguageProvider>
        </AuthProvider>
    </StrictMode>
  </ BrowserRouter>
  
 
)
