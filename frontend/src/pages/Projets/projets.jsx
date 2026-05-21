import './projets.css'
import { useNavigate } from 'react-router-dom'

function Projets() {
  const navigate = useNavigate()

  const projets = [
    { id: 1, nom: "Système distribué", groupe: "Algo & Réseaux", description: "Implémentation d'un système distribué en Java", avancement: 75, dateLimite: "30 mai" },
    { id: 2, nom: "Refonte UI Dashboard", groupe: "Équipe Design UX", description: "Redesign complet du tableau de bord utilisateur", avancement: 40, dateLimite: "15 juin" },
    { id: 3, nom: "Modèle de prédiction", groupe: "Data Science Python", description: "Modèle ML pour prédire les résultats étudiants", avancement: 20, dateLimite: "20 juin" },
  ]

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
                <p className="projet-groupe">{projet.groupe}</p>
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