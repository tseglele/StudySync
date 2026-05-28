import { useState } from 'react'
import './groupes.css'

const groupesData = [
  {
    id: 1,
    nom: "Groupe Algo & Réseaux",
    cours: "L3 Informatique — Pr. Dumont",
    emoji: "⬡",
    membres: ["AM", "JD", "SL", "TR"],
    projetsActifs: 3,
    tachesFaites: 12,
  },
  {
    id: 2,
    nom: "Équipe Design UX",
    cours: "L3 Design — Prof. Lemaire",
    emoji: "🎨",
    membres: ["SL", "AM", "MB"],
    projetsActifs: 1,
    tachesFaites: 8,
  },
  {
    id: 3,
    nom: "Data Science Python",
    cours: "M1 IA — Prof. Bernard",
    emoji: "🐍",
    membres: ["AM", "TR"],
    projetsActifs: 1,
    tachesFaites: 5,
  },
]

const couleurs = ["#7c5cfc", "#f59e4a", "#2dd4a0", "#f0506e", "#60a5fa"]

function Groupes() {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ nom: '', cours: '' })

  return (
    <div className="groupes-page">
      <div className="groupes-topbar">
        <span className="groupes-title-top">Mes Groupes</span>
        <div className="groupes-icons">
          <span>+</span>
          <span>🔔</span>
          <span className="avatar-top">AM</span>
        </div>
      </div>

      <h1 className="groupes-titre">Mes Groupes</h1>
      <p className="groupes-sub">Collaboration avec tes camarades de cours</p>

      <div className="groupes-meta">
        <span>{groupesData.length} groupes actifs ce semestre</span>
        <button className="btn-rejoindre" onClick={() => setShowModal(true)}>+ Rejoindre / Créer</button>
      </div>

      <div className="groupes-grid">
        {groupesData.map((groupe) => (
          <div key={groupe.id} className="groupe-carte">
            <div className="groupe-header">
              <div className="groupe-emoji">{groupe.emoji}</div>
              <div>
                <p className="groupe-nom">{groupe.nom}</p>
                <p className="groupe-cours">{groupe.cours}</p>
              </div>
            </div>
            <div className="groupe-membres">
              {groupe.membres.slice(0, 3).map((m, i) => (
                <div key={i} className="avatar-membre" style={{ background: couleurs[i % couleurs.length] }}>{m}</div>
              ))}
              {groupe.membres.length > 3 && (
                <div className="avatar-membre avatar-plus">+{groupe.membres.length - 3}</div>
              )}
              <span className="membres-count">{groupe.membres.length} membres</span>
            </div>
            <div className="groupe-stats">
              <div className="stat-box">
                <span className="stat-number">{groupe.projetsActifs}</span>
                <span className="stat-label">Projets actifs</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{groupe.tachesFaites}</span>
                <span className="stat-label">Tâches faites</span>
              </div>
            </div>
          </div>
        ))}

        <div className="groupe-carte groupe-vide">
          <div className="vide-icon">◯</div>
          <p className="vide-text">Rejoindre un groupe</p>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Rejoindre / Créer un groupe</h2>
            <div className="modal-field">
              <label>Nom du groupe *</label>
              <input type="text" placeholder="Ex: Groupe Algo & Réseaux" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
            </div>
            <div className="modal-field">
              <label>Cours</label>
              <input type="text" placeholder="Ex: L3 Informatique — Pr. Dumont" value={form.cours} onChange={e => setForm({ ...form, cours: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn-annuler" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn-rejoindre" onClick={() => setShowModal(false)}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Groupes
