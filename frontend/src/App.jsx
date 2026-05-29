import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Inscription from './pages/Inscription/Inscription.jsx'
import Connexion from './pages/Connexion/Connexion.jsx'
import Projets from './pages/Projets/projets.jsx'
import Planner from './pages/Planner/Planner'
import Profil from './pages/Profil/Profil.jsx'
import Groupes from './pages/Groupes/Groupes.jsx'

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Inscription />} />
      <Route path="/login" element={<Connexion />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/projets" element={<Projets />} />
      <Route path="/planner" element={<Planner />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/groupes" element={<Groupes />} />
    </Routes>
  )
}

export default App