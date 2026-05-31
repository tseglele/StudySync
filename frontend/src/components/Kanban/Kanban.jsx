import { useState, useEffect } from 'react'
import api from '../../Api.jsx'
import './kanban.css'

const colonnes = [
  { id: "todo",        label: "À faire"  },
  { id: "in_progress", label: "En cours" },
  { id: "done",        label: "Terminé"  },
]

const couleurNiveau = {
  "CRITIQUE": "#ef4444",
  "URGENT":   "#f59e4a",
  "NORMAL":   "#7c6ef5",
  "FAIBLE":   "#2dd4a0",
}

function Kanban({ projetId, projetNom, onFermer, onTacheUpdate, groupeId }) {
  const [taches, setTaches] = useState([])
  const [membres, setMembres] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ titre: '', assignee: '', deadline: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!projetId) return

    api.get(`/api/projets/${projetId}/taches`)
      .then(res => setTaches(res.data))
      .catch(err => console.error(err))

    if (groupeId) {
      api.get(`/api/groupes/${groupeId}/membres`)
        .then(res => setMembres(res.data))
        .catch(err => console.error(err))
    }
  }, [projetId, groupeId])

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
      setForm({ titre: '', assignee: '', deadline: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatut = async (tacheId, nouveauStatut) => {
    try {
      await api.patch(`/api/taches/${tacheId}/statut`, { statut: nouveauStatut })
      setTaches(prev => prev.map(t => t.id === tacheId ? { ...t, statut: nouveauStatut } : t))
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
                      <span className="tache-priorite" style={{ color: colonne.id === 'done' ? '#2dd4a0' : couleurNiveau[tache.niveauPriorite] }}>
                        {colonne.id === 'done' ? '✓ Fait' : tache.niveauPriorite || ''}
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
            {membres.length > 0 && (
              <div className="modal-field">
                <label>Assigné à</label>
                <select value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}>
                  <option value="">Choisir un membre</option>
                  {membres.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="modal-field">
              <label>Date limite</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
              />
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