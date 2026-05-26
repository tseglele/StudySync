/*
  PlannerPage.jsx — Nouvelle version redesignée
  
  Où le mettre : client/src/pages/PlannerPage.jsx
  
  Ce qu'il faut installer :
    npm install @fontsource/dm-sans @fontsource/dm-mono
  
  Pour l'utiliser dans App.jsx ou le router :
    import PlannerPage from './pages/PlannerPage'
*/

import { useState } from "react"

/* ─────────────────────────────────────────────────────
   DONNÉES INITIALES (tâches de démo)
   Plus tard ces données viendront du backend.
   "id" = identifiant unique de chaque tâche
───────────────────────────────────────────────────── */
const TACHES_DEMO = [
  { id: 1, title: "Rapport de projet distribué", course: "Algo & Réseaux", dueDate: new Date(Date.now() + 86400000).toISOString(), priority: "high", status: "todo" },
  { id: 2, title: "Série d'exercices 7 — Intégrales", course: "Analyse", dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), priority: "high", status: "todo" },
  { id: 3, title: "Slides présentation UX — 12 slides", course: "Design", dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), priority: "medium", status: "todo" },
  { id: 4, title: "Introduction du mémoire (~800 mots)", course: "Mémoire M1", dueDate: new Date(Date.now() + 6 * 86400000).toISOString(), priority: "medium", status: "todo" },
  { id: 5, title: "Révisions algorithmes de tri", course: "Algorithmique", dueDate: new Date(Date.now() + 9 * 86400000).toISOString(), priority: "low", status: "todo" },
  { id: 6, title: "Lire chapitres 4–6 Base de données", course: "BDD", dueDate: new Date(Date.now() - 86400000).toISOString(), priority: "low", status: "done" },
  { id: 7, title: "TP Python — Fichiers CSV", course: "Python", dueDate: new Date(Date.now() - 2 * 86400000).toISOString(), priority: "low", status: "done" },
]

const FORM_VIDE = { title: "", course: "", dueDate: "", priority: "medium", notes: "" }

/* ─────────────────────────────────────────────────────
   FONCTION UTILITAIRE : formater une date
   Reçoit une date ISO, retourne { texte, urgent }
───────────────────────────────────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return null
  const jours = Math.ceil((new Date(dateStr) - new Date()) / 86400000)
  if (jours < 0)  return { text: "En retard",   urgent: true }
  if (jours === 0) return { text: "Aujourd'hui", urgent: true }
  if (jours === 1) return { text: "Demain",      urgent: true }
  return {
    text: new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    urgent: false,
  }
}

/* ─────────────────────────────────────────────────────
   COMPOSANT PRINCIPAL : PlannerPage
───────────────────────────────────────────────────── */
export default function PlannerPage() {
  // Liste de toutes les tâches
  const [taches, setTaches] = useState(TACHES_DEMO)
  // Onglet actif dans la vue "En cours"
  const [filtre, setFiltre] = useState("tout")
  // Modal ouvert ou fermé
  const [modalOuvert, setModalOuvert] = useState(false)
  // Si on modifie une tâche existante, elle est stockée ici
  const [enEdition, setEnEdition] = useState(null)
  // Valeurs du formulaire dans le modal
  const [form, setForm] = useState(FORM_VIDE)

  /* ── Groupes de tâches ── */
  const todo     = taches.filter(t => t.status !== "done")
  const done     = taches.filter(t => t.status === "done")
  const urgentes = todo.filter(t => { const j = (new Date(t.dueDate) - new Date()) / 86400000; return j < 3 })
  const semaine  = todo.filter(t => { if (!t.dueDate) return true; const j = (new Date(t.dueDate) - new Date()) / 86400000; return j >= 3 })

  /* ── Stats ── */
  const total       = taches.length
  const pourcentage = total > 0 ? Math.round((done.length / total) * 100) : 0

  /* ── Cocher / décocher une tâche ── */
  function toggleTache(tache) {
    setTaches(prev => prev.map(t =>
      t.id === tache.id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t
    ))
  }

  /* ── Supprimer une tâche ── */
  function supprimerTache(id) {
    setTaches(prev => prev.filter(t => t.id !== id))
  }

  /* ── Ouvrir modal pour créer ── */
  function ouvrirCreation() {
    setEnEdition(null)
    setForm(FORM_VIDE)
    setModalOuvert(true)
  }

  /* ── Ouvrir modal pour modifier ── */
  function ouvrirEdition(tache) {
    setEnEdition(tache)
    setForm({ title: tache.title, course: tache.course || "", dueDate: tache.dueDate ? tache.dueDate.slice(0,10) : "", priority: tache.priority || "medium", notes: tache.notes || "" })
    setModalOuvert(true)
  }

  /* ── Valider le formulaire ── */
  function valider() {
    if (!form.title.trim()) return
    if (enEdition) {
      setTaches(prev => prev.map(t => t.id === enEdition.id ? { ...t, ...form } : t))
    } else {
      setTaches(prev => [{ id: Date.now(), status: "todo", ...form }, ...prev])
    }
    setModalOuvert(false)
  }

  /* ── Tâches filtrées pour l'affichage principal ── */
  const tachesAffichees = filtre === "urgent" ? urgentes : filtre === "semaine" ? semaine : todo

  return (
    <>
      {/* ── Injection des styles inline ── */}
      <style>{STYLES}</style>

      <div className="pl-root">

        {/* ══════════════════════════════════════
            EN-TÊTE
        ══════════════════════════════════════ */}
        <header className="pl-header">
          <div>
            <p className="pl-eyebrow">Workspace étudiant</p>
            <h1 className="pl-title">Mon <em>Planner</em></h1>
          </div>
          {/* Mini progression dans l'en-tête */}
          <div className="pl-header-right">
            <div className="pl-ring-wrap">
              <svg className="pl-ring" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity=".12"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeDasharray={`${pourcentage * 0.942} 94.2`}
                  strokeLinecap="round" strokeDashoffset="23.55" style={{transition:"stroke-dasharray .8s ease"}}/>
              </svg>
              <span className="pl-ring-num">{pourcentage}%</span>
            </div>
            <button className="pl-btn-add" onClick={ouvrirCreation}>
              <span>＋</span> Nouvelle tâche
            </button>
          </div>
        </header>

        {/* ══════════════════════════════════════
            STATS RAPIDES
        ══════════════════════════════════════ */}
        <div className="pl-stats">
          <div className="pl-stat pl-stat--accent">
            <span className="pl-stat-num">{urgentes.length}</span>
            <span className="pl-stat-lbl">Urgentes</span>
          </div>
          <div className="pl-stat pl-stat--amber">
            <span className="pl-stat-num">{semaine.length}</span>
            <span className="pl-stat-lbl">Cette semaine</span>
          </div>
          <div className="pl-stat pl-stat--green">
            <span className="pl-stat-num">{done.length}</span>
            <span className="pl-stat-lbl">Terminées</span>
          </div>
          <div className="pl-stat pl-stat--muted">
            <span className="pl-stat-num">{total}</span>
            <span className="pl-stat-lbl">Total</span>
          </div>
        </div>

        {/* ══════════════════════════════════════
            FILTRES
        ══════════════════════════════════════ */}
        <div className="pl-filtres">
          {[
            { key: "tout",    label: "Toutes",        count: todo.length },
            { key: "urgent",  label: "🔴 Urgentes",  count: urgentes.length },
            { key: "semaine", label: "📅 Semaine",   count: semaine.length },
          ].map(f => (
            <button key={f.key} className={`pl-filtre ${filtre === f.key ? "pl-filtre--on" : ""}`} onClick={() => setFiltre(f.key)}>
              {f.label}
              <span className="pl-filtre-badge">{f.count}</span>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════
            LISTE DES TÂCHES EN COURS
        ══════════════════════════════════════ */}
        <div className="pl-liste">
          {tachesAffichees.length === 0 ? (
            <div className="pl-empty">
              <div className="pl-empty-icon">✦</div>
              <p>Aucune tâche ici — bien joué !</p>
            </div>
          ) : (
            tachesAffichees.map((tache, i) => (
              <TaskCard
                key={tache.id}
                tache={tache}
                index={i}
                onToggle={toggleTache}
                onEdit={ouvrirEdition}
                onDelete={supprimerTache}
              />
            ))
          )}
        </div>

        {/* ══════════════════════════════════════
            TÂCHES TERMINÉES (accordéon)
        ══════════════════════════════════════ */}
        {done.length > 0 && (
          <details className="pl-done-wrap">
            <summary className="pl-done-toggle">
              <span>✅ Tâches terminées</span>
              <span className="pl-filtre-badge">{done.length}</span>
            </summary>
            <div className="pl-liste pl-liste--done">
              {done.map((tache, i) => (
                <TaskCard
                  key={tache.id}
                  tache={tache}
                  index={i}
                  onToggle={toggleTache}
                  onEdit={ouvrirEdition}
                  onDelete={supprimerTache}
                />
              ))}
            </div>
          </details>
        )}

      </div>

      {/* ══════════════════════════════════════
          MODAL CRÉATION / MODIFICATION
      ══════════════════════════════════════ */}
      {modalOuvert && (
        <div className="pl-modal-bg" onClick={e => e.target === e.currentTarget && setModalOuvert(false)}>
          <div className="pl-modal">
            <div className="pl-modal-header">
              <h2 className="pl-modal-title">{enEdition ? "Modifier" : "Nouvelle tâche"}</h2>
              <button className="pl-modal-close" onClick={() => setModalOuvert(false)}>✕</button>
            </div>

            {/* Champ titre */}
            <div className="pl-field">
              <label className="pl-label">Titre <span className="pl-req">*</span></label>
              <input className="pl-input" type="text" placeholder="Ex : Rapport de projet..."
                value={form.title} onChange={e => setForm({...form, title: e.target.value})} autoFocus/>
            </div>

            {/* Cours + Priorité côte à côte */}
            <div className="pl-row">
              <div className="pl-field">
                <label className="pl-label">Cours</label>
                <input className="pl-input" type="text" placeholder="Algo & Réseaux"
                  value={form.course} onChange={e => setForm({...form, course: e.target.value})}/>
              </div>
              <div className="pl-field">
                <label className="pl-label">Priorité</label>
                <select className="pl-input" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option value="high">🔴 Urgent</option>
                  <option value="medium">🟡 Moyen</option>
                  <option value="low">🟢 Normal</option>
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="pl-field">
              <label className="pl-label">Échéance</label>
              <input className="pl-input" type="date"
                value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})}/>
            </div>

            {/* Notes */}
            <div className="pl-field">
              <label className="pl-label">Notes (optionnel)</label>
              <textarea className="pl-input pl-textarea" placeholder="Détails, ressources..."
                value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}/>
            </div>

            {/* Boutons */}
            <div className="pl-modal-footer">
              <button className="pl-btn-ghost" onClick={() => setModalOuvert(false)}>Annuler</button>
              <button className="pl-btn-add" onClick={valider}>
                {enEdition ? "Mettre à jour" : "Créer la tâche"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────
   COMPOSANT : TaskCard — une ligne de tâche
   
   Props reçues :
   - tache   : l'objet tâche
   - index   : numéro dans la liste (pour l'animation décalée)
   - onToggle, onEdit, onDelete : fonctions du parent
───────────────────────────────────────────────────── */
function TaskCard({ tache, index, onToggle, onEdit, onDelete }) {
  const done = tache.status === "done"
  const due  = formatDate(tache.dueDate)

  // Couleur de la bordure gauche selon priorité
  const borderColor = tache.priority === "high" ? "var(--red)" : tache.priority === "medium" ? "var(--amber)" : "var(--green)"

  return (
    <div
      className={`pl-card ${done ? "pl-card--done" : ""}`}
      style={{ animationDelay: `${index * 40}ms`, borderLeftColor: done ? "var(--border)" : borderColor }}
    >
      {/* Checkbox */}
      <button
        className={`pl-check ${done ? "pl-check--on" : ""}`}
        onClick={() => onToggle(tache)}
        title={done ? "Marquer comme à faire" : "Marquer comme terminé"}
      >
        {done && "✓"}
      </button>

      {/* Contenu */}
      <div className="pl-card-body">
        <p className={`pl-card-title ${done ? "pl-card-title--done" : ""}`}>{tache.title}</p>
        <div className="pl-card-meta">
          {tache.course && <span className="pl-chip">📚 {tache.course}</span>}
          {due && <span className={`pl-chip ${done ? "pl-chip--green" : due.urgent ? "pl-chip--red" : ""}`}>
            {done ? "✓ Terminé" : `⏱ ${due.text}`}
          </span>}
          <PriorityDot priority={tache.priority} done={done}/>
        </div>
      </div>

      {/* Actions (visibles au survol via CSS) */}
      <div className="pl-card-actions">
        <button className="pl-act" onClick={() => onEdit(tache)} title="Modifier">✏</button>
        <button className="pl-act pl-act--del" onClick={() => onDelete(tache.id)} title="Supprimer">✕</button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   COMPOSANT : PriorityDot — petit badge de priorité
───────────────────────────────────────────────────── */
function PriorityDot({ priority, done }) {
  if (done) return null
  const map = { high: ["🔴", "pl-dot--red"], medium: ["🟡", "pl-dot--amber"], low: ["🟢", "pl-dot--green"] }
  const [emoji, cls] = map[priority] || map.low
  return <span className={`pl-dot ${cls}`}>{priority === "high" ? "Urgent" : priority === "medium" ? "Moyen" : "Normal"}</span>
}

/* ─────────────────────────────────────────────────────
   STYLES CSS (injectés dans la balise <style>)
   
   Tout le style est ici dans une seule variable.
   Tu peux aussi le déplacer dans un fichier planner.css
   et faire : import './planner.css'
───────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Syne:wght@400;600;700&family=DM+Mono:wght@400&display=swap');

/* ── Variables de couleurs ── */
:root {
  --bg:       #0f0f13;
  --surface:  #16161d;
  --raised:   #1e1e28;
  --border:   #2c2c3a;
  --text:     #eeedf5;
  --muted:    #7a7990;
  --dim:      #45445a;
  --accent:   #6c5ce7;
  --accent-g: rgba(108,92,231,.15);
  --green:    #00c896;
  --green-g:  rgba(0,200,150,.12);
  --amber:    #f09a28;
  --amber-g:  rgba(240,154,40,.12);
  --red:      #e85555;
  --red-g:    rgba(232,85,85,.12);
  --r:        12px;
  --rs:       7px;
  --ease:     cubic-bezier(.4,0,.2,1);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Conteneur principal ── */
.pl-root {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  max-width: 760px;
  margin: 0 auto;
  padding: 36px 24px 60px;
  -webkit-font-smoothing: antialiased;
}

/* ── En-tête ── */
.pl-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 16px;
}

/* Petit texte au-dessus du titre */
.pl-eyebrow {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 6px;
}

/* Le gros titre */
.pl-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  letter-spacing: -1.5px;
  line-height: 1;
  color: var(--text);
}

/* Le mot en italique dans le titre */
.pl-title em {
  font-style: italic;
  font-weight: 400;
  color: var(--accent);
}

/* Côté droit de l'en-tête (anneau + bouton) */
.pl-header-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
  padding-top: 4px;
}

/* L'anneau de progression circulaire */
.pl-ring-wrap {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.pl-ring {
  width: 48px;
  height: 48px;
  color: var(--accent);
  transform: rotate(-90deg);
}

/* Le chiffre au centre de l'anneau */
.pl-ring-num {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: var(--accent);
}

/* ── Bouton principal "+ Nouvelle tâche" ── */
.pl-btn-add {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 50px;
  background: var(--accent);
  color: #fff;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all .18s var(--ease);
  white-space: nowrap;
}

.pl-btn-add:hover {
  background: #7d6ef5;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(108,92,231,.35);
}

/* ── Statistiques rapides ── */
.pl-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}

@media (max-width: 500px) {
  .pl-stats { grid-template-columns: repeat(2, 1fr); }
}

.pl-stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  position: relative;
  overflow: hidden;
}

/* La petite barre colorée en haut de chaque stat */
.pl-stat::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  border-radius: 2px 2px 0 0;
}

.pl-stat--accent::before { background: var(--accent); }
.pl-stat--amber::before  { background: var(--amber);  }
.pl-stat--green::before  { background: var(--green);  }
.pl-stat--muted::before  { background: var(--dim);    }

.pl-stat-num {
  font-family: 'Syne', sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.pl-stat--accent .pl-stat-num { color: var(--accent); }
.pl-stat--amber .pl-stat-num  { color: var(--amber);  }
.pl-stat--green .pl-stat-num  { color: var(--green);  }
.pl-stat--muted .pl-stat-num  { color: var(--muted);  }

.pl-stat-lbl {
  font-size: 11px;
  color: var(--muted);
}

/* ── Filtres (boutons onglets) ── */
.pl-filtres {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.pl-filtre {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 50px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: all .15s var(--ease);
}

.pl-filtre:hover {
  border-color: var(--accent);
  color: var(--text);
}

/* Filtre actif */
.pl-filtre--on {
  background: var(--accent-g);
  border-color: var(--accent);
  color: var(--accent);
}

/* Le petit badge avec le nombre */
.pl-filtre-badge {
  background: var(--raised);
  border-radius: 20px;
  padding: 1px 7px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: var(--dim);
}

.pl-filtre--on .pl-filtre-badge {
  background: var(--accent);
  color: #fff;
}

/* ── Liste des tâches ── */
.pl-liste {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.pl-liste--done {
  margin-top: 12px;
  opacity: .75;
}

/* ── Une carte de tâche ── */
.pl-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);   /* la barre colorée à gauche */
  border-radius: var(--r);
  cursor: default;
  transition: border-color .15s, background .15s, transform .15s;
  animation: enterCard .25s var(--ease) both;
}

@keyframes enterCard {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.pl-card:hover {
  background: var(--raised);
  transform: translateX(2px);
}

/* Tâche terminée : plus discrète */
.pl-card--done {
  opacity: .5;
}

/* ── La checkbox ronde ── */
.pl-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: transparent;
  color: #fff;
  font-size: 11px;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .15s var(--ease);
}

.pl-card:hover .pl-check {
  border-color: var(--accent);
}

/* Checkbox cochée */
.pl-check--on {
  background: var(--green);
  border-color: var(--green);
}

/* ── Corps de la carte ── */
.pl-card-body {
  flex: 1;
  min-width: 0;
}

.pl-card-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Titre barré si terminé */
.pl-card-title--done {
  text-decoration: line-through;
  color: var(--dim);
}

/* Ligne de métadonnées */
.pl-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Un petit chip de texte */
.pl-chip {
  font-size: 11.5px;
  color: var(--muted);
}

.pl-chip--red   { color: var(--red);   }
.pl-chip--green { color: var(--green); }

/* Badge de priorité */
.pl-dot {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 20px;
}

.pl-dot--red   { background: var(--red-g);   color: var(--red);   }
.pl-dot--amber { background: var(--amber-g); color: var(--amber); }
.pl-dot--green { background: var(--green-g); color: var(--green); }

/* ── Boutons d'action (cachés, visibles au survol) ── */
.pl-card-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity .15s;
}

.pl-card:hover .pl-card-actions {
  opacity: 1;
}

/* Chaque bouton action */
.pl-act {
  width: 28px;
  height: 28px;
  border-radius: var(--rs);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .15s;
}

.pl-act:hover {
  color: var(--text);
  border-color: var(--muted);
}

.pl-act--del:hover {
  color: var(--red);
  border-color: var(--red);
  background: var(--red-g);
}

/* ── État vide ── */
.pl-empty {
  text-align: center;
  padding: 40px;
  color: var(--dim);
}

.pl-empty-icon {
  font-size: 32px;
  margin-bottom: 10px;
  color: var(--accent);
  opacity: .4;
}

.pl-empty p {
  font-size: 13px;
}

/* ── Accordéon tâches terminées ── */
.pl-done-wrap {
  margin-top: 24px;
}

/* La ligne "Tâches terminées" cliquable */
.pl-done-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .6px;
  color: var(--muted);
  cursor: pointer;
  list-style: none;
  padding: 8px 0;
  user-select: none;
}

.pl-done-toggle::-webkit-details-marker { display: none; }

.pl-done-toggle:hover { color: var(--text); }

/* ─────────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────────── */

/* Fond sombre derrière le modal */
.pl-modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 20px;
  animation: fadeIn .15s ease;
}

@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }

/* La fenêtre du modal */
.pl-modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px;
  width: 100%;
  max-width: 440px;
  animation: popIn .22s cubic-bezier(.34,1.4,.64,1);
}

@keyframes popIn {
  from { opacity:0; transform: scale(.95) translateY(10px) }
  to   { opacity:1; transform: scale(1)  translateY(0) }
}

/* En-tête du modal */
.pl-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.pl-modal-title {
  font-family: 'Syne', sans-serif;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -.3px;
}

.pl-modal-close {
  width: 30px; height: 30px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s;
}

.pl-modal-close:hover { color: var(--text); border-color: var(--muted); }

/* Groupe label + input */
.pl-field { margin-bottom: 14px; }

/* Le label */
.pl-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .6px;
  color: var(--muted);
  margin-bottom: 6px;
}

.pl-req { color: var(--red); }

/* Champs de saisie */
.pl-input {
  width: 100%;
  padding: 10px 13px;
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: var(--rs);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  outline: none;
  transition: border-color .15s, box-shadow .15s;
}

.pl-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-g);
}

.pl-input::placeholder { color: var(--dim); }
.pl-input option { background: var(--raised); }

.pl-textarea {
  resize: vertical;
  min-height: 72px;
}

/* Deux champs côte à côte */
.pl-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

@media (max-width: 400px) { .pl-row { grid-template-columns: 1fr; } }

/* Pied du modal */
.pl-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

/* Bouton fantôme (annuler) */
.pl-btn-ghost {
  padding: 9px 16px;
  border-radius: 50px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: all .15s;
}

.pl-btn-ghost:hover { color: var(--text); border-color: var(--muted); }

/* Scrollbar */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
`