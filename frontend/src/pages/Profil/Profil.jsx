import Sidebar from "../../components/Sidebar/Sidebar";
import "./Profil.css";
 
function Profil({ user }) {
  // Valeurs par défaut si pas de props
  const nom = user?.nom || "Alex Martin";
  const email = user?.email || "alex@universite.fr";
  const initiales = nom.split(" ").map(n => n[0]).join("").toUpperCase();
 
  return (
    <div className="profil-layout">
      <Sidebar />
      <div className="profil-content">
        <div className="profil-card">
          <div className="profil-avatar">{initiales}</div>
          <h1 className="profil-nom">{nom}</h1>
          <p className="profil-email">{email}</p>
        </div>
      </div>
    </div>
  );
}
 
export default Profil;