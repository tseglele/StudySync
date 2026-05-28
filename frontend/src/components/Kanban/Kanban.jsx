import { useState, useEffect } from 'react'
import api from '../../Api.jsx'
import './kanban.css'

const colonnes = [
  { id: "todo",        label: "À faire"  },
  { id: "in_progress", label: "En cours" },
  { id: "done",        label: "Terminé"  },
]

const couleurPriorite = {
  "Haute":   "#f0506e",
  "Moyenne": "#f59e4a",
  "Basse":   "#2dd4a0",
}

// Reçoit projetId, projetNom et onFermer depuis Projets.jsx
function Kanban({ projetId, projetNom, onFermer, onTacheUpdate }) {
  const [taches, setTaches] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ titre: '', assignee: '', priorite: 'Moyenne' })
  const [loading, setLoading] = useState(false)

  // Recharge les tâches chaque fois qu'on change de projet
 useEffect(() => {
  if (!projetId) return

  api.get(`/api/projets/${projetId}/taches`)
    .then(res => setTaches(res.data))
    .catch(err => console.error(err))
}, [projetId])

  const handleCreate = async () => {
    if (!form.titre) return
    setLoading(true)
    try {
      const res = await api.post(`/api/projets/${projetId}/taches`, {
        ...form,
        statut: 'todo',
        projetId: projetId
      })
      setTaches(prev => [...prev, res.data])
      setShowModal(false)
      setForm({ titre: '', assignee: '', priorite: 'Moyenne' })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatut = async (tacheId, nouveauStatut) => {
  console.log('handleStatut appelé', tacheId, nouveauStatut)
  try {
    await api.patch(`/api/taches/${tacheId}/statut`, { statut: nouveauStatut })
    setTaches(prev => prev.map(t => t.id === tacheId ? { ...t, statut: nouveauStatut } : t))
    console.log('onTacheUpdate existe?', !!onTacheUpdate)
    if (onTacheUpdate) onTacheUpdate()
  } catch (err) {
    console.error(err)
  }
}

  return (
    <div className="kanban-page">
      <div className="kanban-header">
        <button className="btn-retour" onClick={onFermer}>← Fermer</button>
        <h2 className="kanban-titre">Kanban — {projetNom}</h2>
        <button className="btn-rejoindre" onClick={() => setShowModal(true)}>+ Nouvelle tâche</button>
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
                      <span className="tache-assignee">{tache.assignee || '?'}</span>
                      <span className="tache-priorite" style={{ color: colonne.id === 'done' ? '#2dd4a0' : couleurPriorite[tache.priorite] }}>
                        {colonne.id === 'done' ? '✓ Fait' : tache.priorite}
                      </span>
                    </div>
                    <div className="tache-actions">
                      {colonne.id !== 'todo' && (
                        <button onClick={() => handleStatut(tache.id, colonne.id === 'in_progress' ? 'todo' : 'in_progress')}>←</button>
                      )}
                      {colonne.id !== 'done' && (
                        <button onClick={() => handleStatut(tache.id, colonne.id === 'todo' ? 'in_progress' : 'done')}>→</button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Nouvelle tâche</h2>
            <div className="modal-field">
              <label>Titre *</label>
              <input type="text" placeholder="Ex: Configurer les serveurs" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} />
            </div>
            <div className="modal-field">
              <label>Assigné à</label>
              <input type="text" placeholder="Ex: AM" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} />
            </div>
            <div className="modal-field">
              <label>Priorité</label>
              <select value={form.priorite} onChange={e => setForm({ ...form, priorite: e.target.value })}>
                <option>Haute</option>
                <option>Moyenne</option>
                <option>Basse</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-annuler" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn-rejoindre" onClick={handleCreate} disabled={loading}>
                {loading ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Kanban