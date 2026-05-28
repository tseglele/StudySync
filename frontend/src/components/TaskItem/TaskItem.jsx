
/* ============================================================
   TaskItem.jsx — Composant d'une seule tâche
   
   Ce composant affiche UNE tâche avec :
   - Le rond à cocher à gauche
   - Le titre et les infos (cours, date, badge)
   - Les boutons Modifier ✏ et Supprimer ✕ (visibles au survol)
   
   Il reçoit ces "props" (paramètres) depuis PlannerPage :
   - task       → l'objet tâche { id, title, course, dueDate, priority, status }
   - onToggle   → fonction appelée quand on coche/décoche
   - onDelete   → fonction appelée quand on supprime
   - onEdit     → fonction appelée quand on clique sur Modifier
============================================================ */
 
// On importe React (obligatoire dans chaque fichier JSX)
import React from 'react'
 
// ─── Fonction utilitaire ──────────────────────────────────────────────────────
// Cette fonction transforme une date en texte lisible
// Ex: si la date est demain → "Demain"
//     si la date est dans 5 jours → "20 mai"
//     si la date est passée → "En retard"
function formatDate(dateStr) {
  if (!dateStr) return null  // pas de date → on affiche rien
 
  const date = new Date(dateStr)
  const today = new Date()
  const diffMs = date - today                    // différence en millisecondes
  const diffDays = Math.ceil(diffMs / 86400000)  // conversion en jours (1 jour = 86400000 ms)
 
  if (diffDays < 0)  return { text: 'En retard', urgent: true  }
  if (diffDays === 0) return { text: "Aujourd'hui", urgent: true  }
  if (diffDays === 1) return { text: 'Demain',     urgent: true  }
 
  // Sinon : "20 mai", "3 juin", etc.
  return {
    text: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    urgent: false
  }
}
 
 
// ─── Composant TaskItem ───────────────────────────────────────────────────────
// "export default" = ce composant peut être importé dans d'autres fichiers
export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
 
  // On calcule la date formatée une fois ici
  const due = formatDate(task.dueDate)
 
  // Est-ce que la tâche est terminée ?
  const isDone = task.status === 'done'
 
 
  return (
    // La ligne de la tâche
    // className change si la tâche est terminée (pour la rendre transparente)
    <div className={`task-item ${isDone ? 'is-done' : ''}`}>
 
      {/* ── Le rond à gauche (checkbox) ── */}
      <div
        className={`task-checkbox ${isDone ? 'checked' : ''}`}
        onClick={() => onToggle(task)}   // appelle onToggle quand on clique
        title={isDone ? 'Marquer comme à faire' : 'Marquer comme terminé'}
      >
        {/* Affiche ✓ seulement si la tâche est faite */}
        {isDone && '✓'}
      </div>
 
      {/* ── Le contenu principal (titre + méta-infos) ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
 
        {/* Le titre, barré si terminé */}
        <div className={`task-title ${isDone ? 'striked' : ''}`}>
          {task.title}
        </div>
 
        {/* Les infos en dessous du titre */}
        <div className="task-meta">
 
          {/* Le cours (ex: "📚 Algo & Réseaux") — affiché seulement s'il existe */}
          {task.course && (
            <span className="meta-info">📚 {task.course}</span>
          )}
 
          {/* La date (ex: "⏱ Demain") — affichée seulement si elle existe */}
          {due && (
            <span className={`meta-info ${isDone ? 'completed' : due.urgent ? 'urgent' : ''}`}>
              {isDone ? '✓ Terminé' : `⏱ ${due.text}`}
            </span>
          )}
 
          {/* Le badge de priorité (Urgent / Moyen / Normal) */}
          <PriorityBadge priority={task.priority} />
 
        </div>
      </div>
 
      {/* ── Les boutons d'action à droite (cachés, visibles au survol) ── */}
      <div className="task-actions">
 
        {/* Bouton Modifier */}
        <button
          className="action-btn"
          onClick={() => onEdit(task)}   // ouvre le modal avec les infos de cette tâche
          title="Modifier"
        >
          ✏
        </button>
 
        {/* Bouton Supprimer */}
        <button
          className="action-btn delete"
          onClick={() => onDelete(task.id)}   // supprime la tâche
          title="Supprimer"
        >
          ✕
        </button>
 
      </div>
    </div>
  )
}
 
 
// ─── Sous-composant PriorityBadge ─────────────────────────────────────────────
// Un tout petit composant utilisé uniquement dans ce fichier
// Il affiche le bon badge selon la priorité
function PriorityBadge({ priority }) {
  if (priority === 'high')   return <span className="badge badge-high">Urgent</span>
  if (priority === 'medium') return <span className="badge badge-medium">Moyen</span>
  return                            <span className="badge badge-low">Normal</span>
}
 