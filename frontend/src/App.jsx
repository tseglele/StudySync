import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Dashboard from './pages/Dashboard'
import Inscription from './pages/Inscription/Inscription.jsx'
import Connexion from './pages/Connexion/Connexion.jsx'
import Projets from './pages/Projets/Projets.jsx'
import Kanban from './pages/Kanban/Kanban.jsx'

function App() {
  return (
    <Routes>

        <Route  path="/register" element={<Inscription />} />
        <Route  path="/login" element={<Connexion />} />
        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard />  </ProtectedRoute> }/>
        <Route  path="/projets" element={<Projets />} />
       <Route  path="/projets/:id" element={<Projets />} />
       <Route  path="/kanban" element={<Kanban />} />

      </Routes>

  )
}

export default App
