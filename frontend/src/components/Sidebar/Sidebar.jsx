import "./sidebar.css"
import { Link, useLocation } from "react-router-dom"

function Sidebar() {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Étudiant" }

  const initiales = user.name ? user.name.slice(0, 2).toUpperCase() : "ET"

  return (
    <div className="sidebar">
      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="logo-icon">📁</div>
        <span className="logo-text">StudySync</span>
      </div>

      {/* RECHERCHE */}
      <div className="sidebar-search">
        <span>🔍</span>
        <span className="search-placeholder">Rechercher...</span>
      </div>

      {/* NAVIGATION */}
      <p className="sidebar-label">PRINCIPAL</p>
      <ul className="menu">
        <li className={location.pathname === '/dashboard' ? 'active' : ''}>
          <Link to="/dashboard">🗂 Dashboard</Link>
        </li>
        <li className={location.pathname === '/planner' ? 'active' : ''}>
          <Link to="/planner">📅 Planner</Link>
        </li>
        <li className={location.pathname === '/projets' ? 'active' : ''}>
          <Link to="/projets">📁 Projets</Link>
        </li>
      </ul>

      <p className="sidebar-label">COLLABORATION</p>
      <ul className="menu">
        <li className={location.pathname === '/groupes' ? 'active' : ''}>
          <Link to="/groupes">👥 Groupes</Link>
        </li>
      </ul>

      <p className="sidebar-label">PERSONNEL</p>
      <ul className="menu">
        <li className={location.pathname === '/profil' ? 'active' : ''}>
          <Link to="/profil">👤 Profil</Link>
        </li>
      </ul>

      {/* USER */}
      <div className="sidebar-user">
        <div className="user-avatar">{initiales}</div>
        <div className="user-info">
          <p className="user-name">{user.name}</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar