import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Projets from './pages/Projets/projets'
import Kanban from './pages/Kanban/kanban'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Projets />} />

        <Route path="/projets" element={<Projets />} />

        <Route path="/projets/:id" element={<Kanban />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App