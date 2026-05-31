import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import "./Topbar.css";

function Topbar({ titre }) {
  const { notifications } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Étudiant" };

  return (
    <div className="dashboard-topbar">
      <span className="topbar-titre">{titre}</span>
      <div className="topbar-right">
        <div className="notif-wrapper">
          <button
            className="topbar-btn"
            onClick={() => setShowNotifs(!showNotifs)}
          >
            🔔
            {notifications.filter((n) => !n.lu).length > 0 && (
              <span className="notif-badge">
                {notifications.filter((n) => !n.lu).length}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="notif-dropdown">
              <h4 className="notif-title">Notifications</h4>
              {notifications.length === 0 ? (
                <p className="notif-empty">Aucune notification</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notif-item ${notif.lu ? "lu" : ""}`}
                  >
                    <p>{notif.message}</p>
                    <span className="notif-date">
                      {new Date(notif.createdat).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div
          className="topbar-avatar"
          onClick={() => navigate("/profil")}
          style={{ cursor: "pointer" }}
        >
          {user.name ? user.name.slice(0, 2).toUpperCase() : "ET"}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
