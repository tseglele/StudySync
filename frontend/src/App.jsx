import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Connexion />} />
        <Route path="/register" element={<Inscription />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App