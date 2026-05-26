import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './projets.css'

function Projets() {
  const navigate = useNavigate()
  const [projets, setProjets] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/projets')
      .then(res => res.json())
      .then(data => setProjets(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">Mes Projets</h1>
      <p className="page-sub">Suivi de tes projets de groupe</p>

      <div className="page-meta">
        <span>{projets.length} projets actifs</span>
        <button className="btn-rejoindre">+ Nouveau projet</button>
      </div>

      <div className="projets-liste">
        {projets.map((projet) => (
          <div key={projet.id} className="projet-carte" onClick={() => navigate(`/projets/${projet.id}`)} style={{cursor: 'pointer'}}>
            <div className="projet-header">
              <div>
                <p className="projet-nom">{projet.nom}</p>
              </div>
              <span className="projet-date">📅 {projet.dateLimite}</span>
            </div>

            <p className="projet-description">{projet.description}</p>

            <div className="progression">
              <div className="progression-header">
                <span>Avancement</span>
                <span className="progression-pct">{projet.avancement}%</span>
              </div>
              <div className="barre-fond">
                <div className="barre-remplie" style={{width: `${projet.avancement}%`}}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projets
