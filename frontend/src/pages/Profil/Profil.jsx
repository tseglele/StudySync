import Sidebar from "../../components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../Api";
import "./Profil.css";

function Profil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || { name: "Étudiant", email: "" },
  );

  useEffect(() => {
    api
      .get("/api/profil")
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const nom = user.name || "Étudiant";
  const email = user.email || "";
  const initiales = nom
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const anneeInscription = user.created_at
    ? new Date(user.created_at).getFullYear()
    : new Date().getFullYear();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="profil-layout">
      <Sidebar />

      <div className="profil-content">
        <h1 className="profil-titre">Mon Profil</h1>
        <div className="profil-card">
          <div className="profil-avatar">{initiales}</div>
          <h2 className="profil-nom">{nom}</h2>
          <p className="profil-email">{email}</p>
        </div>
        <div className="profil-stats">
          <div className="profil-stat-card">
            <span className="profil-stat-icon">📋</span>
            <p className="profil-stat-label">Membre depuis</p>
            <p className="profil-stat-value">{anneeInscription}</p>
          </div>
          <div className="profil-stat-card">
            <span className="profil-stat-icon">🎓</span>
            <p className="profil-stat-label">Statut</p>
            <p className="profil-stat-value">Étudiant</p>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

export default Profil;
