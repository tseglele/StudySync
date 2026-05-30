import React, { useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import "./Topbar.css";

function Topbar() {
  const { notifications } = useNotifications()
  const [showNotifs, setShowNotifs] = useState(false)
 const user =
    JSON.parse(localStorage.getItem("user")) ||
    { name: "Étudiant" }

  return (

    <div className="dashboard-topbar">
          <div className="topbar-right">
            <button className="topbar-btn">+</button>
            <div className="notif-wrapper">
              <button className="topbar-btn" onClick={() => setShowNotifs(!showNotifs)}>
                🔔
                {notifications.filter(n => !n.lu).length > 0 && (
                  <span className="notif-badge">
                    {notifications.filter(n => !n.lu).length}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="notif-dropdown">
                  <h4 className="notif-title">Notifications</h4>
                  {notifications.length === 0 ? (
                    <p className="notif-empty">Aucune notification</p>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className={`notif-item ${notif.lu ? 'lu' : ''}`}>
                        <p>{notif.message}</p>
                        <span className="notif-date">
                          {new Date(notif.createdat).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="topbar-avatar">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "ET"}
            </div>
          </div>
        </div>

  )
}

export default Topbar