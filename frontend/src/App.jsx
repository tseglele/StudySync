import { useState } from 'react'
import Connexion from './pages/connexion'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div>
      <h1>Bienvenue sur StudySync app</h1>
      {isLoggedIn ? (
        <h1>Bienvenue sur votre tableau de bord</h1>
      ) : (
        <Connexion />
      )}
    </div>
  )
}





export default App