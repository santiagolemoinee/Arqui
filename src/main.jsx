import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LangProvider } from './LangContext.jsx'
import App from './App.jsx'
import PricingPage from './pages/PricingPage.jsx'
import BuildPage from './pages/BuildPage.jsx'
import SalesPage from './pages/SalesPage.jsx'
import ProjectManagementPage from './pages/ProjectManagementPage.jsx'
import ProcurementPage from './pages/ProcurementPage.jsx'
import TeamManagementPage from './pages/TeamManagementPage.jsx'
import DocumentManagementPage from './pages/DocumentManagementPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import FinancePage from './pages/FinancePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <LangProvider>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/build" element={<BuildPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/project-management" element={<ProjectManagementPage />} />
                <Route path="/procurement" element={<ProcurementPage />} />
                <Route path="/team-management" element={<TeamManagementPage />} />
                <Route path="/document-management" element={<DocumentManagementPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
            </LangProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
