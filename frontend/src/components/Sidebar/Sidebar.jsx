import "./sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">

      <ul className="menu">
        <li><Link to="/dashboard">Dashboard</Link></li>
    
        <li><Link to="/planner">Planner</Link></li>
        <li><Link to="/projets">Projets</Link></li>

        <li><Link to="/profil">Profil</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;