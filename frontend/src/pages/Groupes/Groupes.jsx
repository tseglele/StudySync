import { useState, useEffect } from 'react'
import api from '../../Api.jsx'
import Sidebar from "../../components/Sidebar/Sidebar"
import './groupes.css'

const couleurs = ["#7c5cfc", "#f59e4a", "#2dd4a0", "#f0506e", "#60a5fa"]

function Groupes() {
  const [groupes, setGroupes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [onglet, setOnglet] = useState('creer')
  const [form, setForm] = useState({ nom: '', cours: '', emoji: '' })
  const [codeRejoindre, setCodeRejoindre] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/api/groupes')
      .then(res => setGroupes(res.data))
      .catch(err => console.error(err))
  }, [])

  const handleCreate = async () => {
    if (!form.nom) return
    setLoading(true)
    try {
      const res = await api.post('/api/groupes', form)
      setGroupes(prev => [...prev, { ...res.data, membres: [] }])
      setShowModal(false)
      setForm({ nom: '', cours: '', emoji: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRejoindre = async () => {
    if (!codeRejoindre) return
    alert('Fonctionnalité rejoindre à connecter au backend !')
    setShowModal(false)
  }

  return (
    <div className="groupes-page">
      <Sidebar />
      <div className="page">
        <div className="groupes-topbar">
          <span className="groupes-title-top">Mes Groupes</span>
          <div className="groupes-icons">
            <span>+</span>
            <span>🔔</span>
            <span className="avatar-top">
              {JSON.parse(localStorage.getItem("user"))?.name?.slice(0, 2).toUpperCase() || "ET"}
          </span>
          </div>
        </div>

        <h1 className="groupes-titre">Mes Groupes</h1>
        <p className="groupes-sub">Collaboration avec tes camarades de cours</p>

        <div className="groupes-meta">
          <span>{groupes.length} groupes actifs ce semestre</span>
          <button className="btn-rejoindre" onClick={() => { setShowModal(true); setOnglet('creer') }}>+ Rejoindre / Créer</button>
        </div>

        <div className="groupes-grid">
          {groupes.map((groupe) => (
            <div key={groupe.id} className="groupe-carte">
              <div className="groupe-header">
                <div className="groupe-emoji">{groupe.emoji || '⬡'}</div>
                <div>
                  <p className="groupe-nom">{groupe.nom}</p>
                  <p className="groupe-cours">{groupe.cours}</p>
                </div>
              </div>
              <div className="groupe-membres">
                {groupe.membres.slice(0, 3).map((m, i) => (
                  <div key={i} className="avatar-membre" style={{ background: couleurs[i % couleurs.length] }}>
                    {m.name ? m.name.slice(0, 2).toUpperCase() : '?'}
                  </div>
                ))}
                {groupe.membres.length > 3 && (
                  <div className="avatar-membre avatar-plus">+{groupe.membres.length - 3}</div>
                )}
                <span className="membres-count">{groupe.membres.length} membres</span>
              </div>
              <div className="groupe-stats">
                <div className="stat-box">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Projets actifs</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Tâches faites</span>
                </div>
              </div>
            </div>
          ))}

          <div className="groupe-carte groupe-vide" onClick={() => { setShowModal(true); setOnglet('rejoindre') }}>
            <div className="vide-icon">◯</div>
            <p className="vide-text">Rejoindre un groupe</p>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-onglets">
                <button className={`onglet ${onglet === 'creer' ? 'onglet-actif' : ''}`} onClick={() => setOnglet('creer')}>Créer</button>
                <button className={`onglet ${onglet === 'rejoindre' ? 'onglet-actif' : ''}`} onClick={() => setOnglet('rejoindre')}>Rejoindre</button>
              </div>

              {onglet === 'creer' && (
                <>
                  <h2 className="modal-title">Créer un groupe</h2>
                  <div className="modal-field">
                    <label>Nom du groupe *</label>
                    <input type="text" placeholder="Ex: Groupe Algo & Réseaux" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                  </div>
                  <div className="modal-field">
                    <label>Cours</label>
                    <input type="text" placeholder="Ex: L3 Informatique — Pr. Dumont" value={form.cours} onChange={e => setForm({ ...form, cours: e.target.value })} />
                  </div>
                  <div className="modal-field">
                    <label>Emoji</label>
                    <input type="text" placeholder="Ex: 🎨" value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} />
                  </div>
                  <div className="modal-actions">
                    <button className="btn-annuler" onClick={() => setShowModal(false)}>Annuler</button>
                    <button className="btn-rejoindre" onClick={handleCreate} disabled={loading}>{loading ? 'Création...' : 'Créer'}</button>
                  </div>
                </>
              )}

              {onglet === 'rejoindre' && (
                <>
                  <h2 className="modal-title">Rejoindre un groupe</h2>
                  <div className="modal-field">
                    <label>Nom du groupe</label>
                    <input type="text" placeholder="Ex: Groupe Algo & Réseaux" value={codeRejoindre} onChange={e => setCodeRejoindre(e.target.value)} />
                  </div>
                  <div className="modal-actions">
                    <button className="btn-annuler" onClick={() => setShowModal(false)}>Annuler</button>
                    <button className="btn-rejoindre" onClick={handleRejoindre}>Rejoindre</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Groupes