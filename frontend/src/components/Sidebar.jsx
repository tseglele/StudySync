import { Link, useLocation } from "react-router-dom"

function Sidebar() {

  const location = useLocation()

  return (

    <aside className="sidebar">

      <h2 className="logo">
        StudySync
      </h2>

      <ul className="menu">

        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Dashboard</Link>
        </li>

        <li className={location.pathname === "/planner" ? "active" : ""}>
          <Link to="/planner">Planner</Link>
        </li>

        <li className={location.pathname === "/projects" ? "active" : ""}>
          <Link to="/projects">Projects</Link>
        </li>

        <li className={location.pathname === "/groups" ? "active" : ""}>
          <Link to="/groups">Groups</Link>
        </li>

      </ul>

    </aside>

  )
}

export default Sidebar