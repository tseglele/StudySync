import './Projets.css'

function Projets() {
  const projets = [
    { id: 1, nom: "Système distribué", groupe: "Algo & Réseaux", description: "Implémentation d'un système distribué en Java", avancement: 75, membres: ["AM", "SL", "JD", "TR"], dateLimite: "30 mai" },
    { id: 2, nom: "Refonte UI Dashboard", groupe: "Équipe Design UX", description: "Redesign complet du tableau de bord utilisateur", avancement: 40, membres: ["MP", "CL", "AM"], dateLimite: "15 juin" },
    { id: 3, nom: "Modèle de prédiction", groupe: "Data Science Python", description: "Modèle ML pour prédire les résultats étudiants", avancement: 20, membres: ["AM", "TR"], dateLimite: "20 juin" },
  ]

  const couleurs = ["#7c5cfc", "#2dd4a0", "#f59e4a", "#f0506e", "#4a9eff"]

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
          <div key={projet.id} className="projet-carte">
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

            <div className="membres">
              {projet.membres.map((init, i) => (
                <div key={i} className="avatar" style={{backgroundColor: couleurs[i % couleurs.length]}}>
                  {init}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projets