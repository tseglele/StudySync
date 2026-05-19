import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Groupes from './pages/Groupes/Groupes'
import Projets from './pages/Projets/Projets'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/groupes" element={<Groupes />} />
        <Route path="/projets" element={<Projets />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App