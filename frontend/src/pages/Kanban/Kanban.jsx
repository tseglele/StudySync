import { useParams, useNavigate } from 'react-router-dom'
import './kanban.css'

const toutesLesTaches = {
  1: [
    { id: 1, titre: "Configurer les serveurs", assignee: "AM", priorite: "Urgent", statut: "done" },
    { id: 2, titre: "Implémenter les sockets", assignee: "SL", priorite: "Urgent", statut: "in_progress" },
    { id: 3, titre: "Tester la latence", assignee: "JD", priorite: "Moyen", statut: "todo" },
    
  ],
  2: [
    { id: 5, titre: "Maquettes Figma", assignee: "MP", priorite: "Urgent", statut: "done" },
    { id: 6, titre: "Intégration CSS", assignee: "CL", priorite: "Moyen", statut: "in_progress" },
    { id: 7, titre: "Tests utilisateurs", assignee: "AM", priorite: "Urgent", statut: "todo" },
  ],
  3: [
    { id: 8, titre: "Collecter les données", assignee: "AM", priorite: "Urgent", statut: "done" },
    { id: 9, titre: "Entraîner le modèle", assignee: "TR", priorite: "Urgent", statut: "in_progress" },
  ],
}

const colonnes = [
  { id: "todo", label: "À faire" },
  { id: "in_progress", label: "En cours" },
  
  { id: "done", label: "Terminé" },
]

const couleurPriorite = {
  "Urgent": "#f0506e",
  "Moyen": "#f59e4a",
  "Fait": "#2dd4a0",
}

function Kanban() {
  const { id } = useParams()
  const navigate = useNavigate()
  const taches = toutesLesTaches[id] || []

  return (
    <div className="kanban-page">
      <div className="kanban-header">
        <button className="btn-retour" onClick={() => navigate('/projets')}>← Retour</button>
        <h1 className="kanban-titre">Kanban — Projet {id}</h1>
      </div>

      <div className="kanban-board">
        {colonnes.map((colonne) => (
          <div key={colonne.id} className="kanban-colonne">
            <div className="colonne-header">
              <span className="colonne-titre">{colonne.label}</span>
              <span className="colonne-count">
                {taches.filter(t => t.statut === colonne.id).length}
              </span>
            </div>

            <div className="colonne-taches">
              {taches
                .filter(t => t.statut === colonne.id)
                .map(tache => (
                  <div key={tache.id} className={`tache-carte ${colonne.id === 'done' ? 'tache-done' : ''}`}>
                    <p className="tache-titre">{tache.titre}</p>
                    <div className="tache-footer">
                      <span className="tache-assignee">{tache.assignee}</span>
                      <span className="tache-priorite" style={{color: colonne.id === 'done' ? '#2dd4a0' : couleurPriorite[tache.priorite]}}>
                       {colonne.id === 'done' ? '✓ Fait' : tache.priorite}
                      </span>   
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Kanban