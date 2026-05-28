import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import OnboardingPage from './pages/OnboardingPage'
import ProjectTelemetryPage from './pages/ProjectTelemetryPage'
import ProjectBillingPage from './pages/ProjectBillingPage'
import ProjectCredentialsPage from './pages/ProjectCredentialsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id/telemetry" element={<ProjectTelemetryPage />} />
        <Route path="/projects/:id/billing" element={<ProjectBillingPage />} />
        <Route path="/projects/:id/credentials" element={<ProjectCredentialsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App