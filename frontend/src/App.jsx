
import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import Groupes from '../pages/Groupes/groupes'
import Projets from '../pages/Projets/projets'

function App() {
  return (
    <BrowserRouter>

      <div className="app-layout">

        <Sidebar />

        <div className="main-content">

          <Navbar />

          <Routes>
            <Route path="/groupes" element={<Groupes />} />
            <Route path="/projets" element={<Projets />} />
          </Routes>

        </div>

      </div>

    </BrowserRouter>
  )
}

export default App