import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Api";
import "./Inscription.css";

function Inscription() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/login");
    } catch (err) {
      setError("Une erreur est survenue");
      console.error(err);
    }
  };

  return (
    <div className="inscription-wrapper">
      <div className="inscription-card">
        <h2 className="inscription-title">Créer un compte</h2>
        <p className="inscription-subtitle">
          Rejoins StudySync et organise ton travail.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ton prénom"
              required
            />
          </div>

          <div className="form-group">
            <label>Adresse Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@universite.fr"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button className="btn-submit" type="submit">
            S'inscrire →
          </button>
        </form>

        <p className="inscription-footer">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
}

export default Inscription;
