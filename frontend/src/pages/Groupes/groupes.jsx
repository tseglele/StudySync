import './groupes.css'

function Groupes() {
  const couleurs = ["#7c5cfc", "#2dd4a0", "#f59e4a", "#f0506e", "#4a9eff"]

  const groupes = [
    { id: 1, nom: "Groupe Algo & Réseaux", matiere: "L3 Informatique", prof: "Pr. Dumont", membres: ["AM", "SL", "JD", "TR"], projetsActifs: 3, tachesFaites: 12 },
    { id: 2, nom: "Équipe Design UX", matiere: "L3 Design", prof: "Prof. Lemaire", membres: ["MP", "CL", "AM"], projetsActifs: 1, tachesFaites: 8 },
    { id: 3, nom: "Data Science Python", matiere: "M1 IA", prof: "Prof. Bernard", membres: ["AM", "TR"], projetsActifs: 1, tachesFaites: 5 },
  ]

  return (
    <div className="page">
      <h1 className="page-title">Mes Groupes</h1>
      <p className="page-sub">Collaboration avec tes camarades de cours</p>

      <div className="page-meta">
        <span>{groupes.length} groupes actifs ce semestre</span>
        <button className="btn-rejoindre">+ Rejoindre / Créer</button>
      </div>

      <div className="grille">
        {groupes.map((groupe) => (
          <div key={groupe.id} className="carte">
            <p className="carte-nom">{groupe.nom}</p>
            <p className="carte-info">{groupe.matiere} — {groupe.prof}</p>
            <div className="membres">
              {groupe.membres.map((init, i) => (
                <div key={i} className="avatar" style={{backgroundColor: couleurs[i % couleurs.length]}}>
                  {init}
                </div>
              ))}
              <span className="membres-count">{groupe.membres.length} membres</span>
            </div>
            <div className="stats">
              <div className="stat-box">
                <p>{groupe.projetsActifs}</p>
                <p>Projets actifs</p>
              </div>
              <div className="stat-box">
                <p>{groupe.tachesFaites}</p>
                <p>Tâches faites</p>
              </div>
            </div>
          </div>
        ))}

        <div className="carte-rejoindre">
          <span style={{fontSize: '28px'}}>○</span>
          <span>Rejoindre un groupe</span>
        </div>
      </div>
    </div>
  )
}

export default Groupes