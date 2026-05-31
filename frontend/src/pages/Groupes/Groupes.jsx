import { useState, useEffect } from "react";
import api from "../../Api.jsx";
import Sidebar from "../../components/Sidebar/Sidebar";
import Kanban from "../../components/Kanban/Kanban";
import "./groupes.css";

const couleurs = ["#7c5cfc", "#f59e4a", "#2dd4a0", "#f0506e", "#60a5fa"];

function Groupes() {
  const [groupes, setGroupes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [onglet, setOnglet] = useState("creer");
  const [form, setForm] = useState({ nom: "", cours: "", emoji: "" });
  const [codeRejoindre, setCodeRejoindre] = useState("");
  const [loading, setLoading] = useState(false);
  const [groupeActif, setGroupeActif] = useState(null);
  const [projetsGroupe, setProjetsGroupe] = useState([]);
  const [showProjetModal, setShowProjetModal] = useState(false);
  const [formProjet, setFormProjet] = useState({
    nom: "",
    description: "",
    dateLimite: "",
  });
  const [projetActifGroupe, setProjetActifGroupe] = useState(null);

  useEffect(() => {
    api
      .get("/api/groupes")
      .then((res) => setGroupes(res.data))
      .catch((err) => console.error(err));
  }, []);

  const chargerProjets = async (groupeId) => {
    try {
      const res = await api.get(`/api/groupes/${groupeId}/projets`);
      setProjetsGroupe(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProjet = async () => {
    if (!formProjet.nom) return;
    try {
      const res = await api.post(
        `/api/groupes/${groupeActif.id}/projets`,
        formProjet,
      );
      setProjetsGroupe((prev) => [...prev, res.data]);
      setShowProjetModal(false);
      setFormProjet({ nom: "", description: "", dateLimite: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    if (!form.nom) return;
    setLoading(true);
    try {
      const res = await api.post("/api/groupes", form);
      setGroupes((prev) => [...prev, { ...res.data, membres: [] }]);
      setShowModal(false);
      setForm({ nom: "", cours: "", emoji: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejoindre = async () => {
    if (!codeRejoindre) return;
    setLoading(true);
    try {
      const res = await api.post("/api/groupes/rejoindre", {
        code_invitation: codeRejoindre,
      });
      alert(`✅ ${res.data.message}`);
      setShowModal(false);
      setCodeRejoindre("");
      const groupesRes = await api.get("/api/groupes");
      setGroupes(groupesRes.data);
    } catch (err) {
      alert("❌ Code invalide ou groupe introuvable");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="groupes-page">
      <Sidebar />
      <div className="page">
        <div className="groupes-topbar">
          <span className="groupes-title-top">Mes Groupes</span>
          <div className="groupes-icons">
            <span>+</span>
            <span>🔔</span>
            <span className="avatar-top">
              {JSON.parse(localStorage.getItem("user"))
                ?.name?.slice(0, 2)
                .toUpperCase() || "ET"}
            </span>
          </div>
        </div>

        <h1 className="groupes-titre">Mes Groupes</h1>
        <p className="groupes-sub">Collaboration avec tes camarades de cours</p>

        <div className="groupes-meta">
          <span>{groupes.length} groupes actifs ce semestre</span>
          <button
            className="btn-rejoindre"
            onClick={() => {
              setShowModal(true);
              setOnglet("creer");
            }}
          >
            + Rejoindre / Créer
          </button>
        </div>

        <div className="groupes-grid">
          {groupes.map((groupe) => (
            <div
              key={groupe.id}
              className={`groupe-carte ${groupeActif?.id === groupe.id ? "groupe-actif" : ""}`}
              onClick={() => {
                setGroupeActif(groupe);
                chargerProjets(groupe.id);
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="groupe-header">
                <div className="groupe-emoji">{groupe.emoji || "⬡"}</div>
                <div>
                  <p className="groupe-nom">{groupe.nom}</p>
                  <p className="groupe-cours">{groupe.cours}</p>
                </div>
              </div>
              <div className="groupe-membres">
                {(groupe.membres || []).slice(0, 3).map((m, i) => (
                  <div
                    key={i}
                    className="avatar-membre"
                    style={{ background: couleurs[i % couleurs.length] }}
                  >
                    {m.name ? m.name.slice(0, 2).toUpperCase() : "?"}
                  </div>
                ))}
                {(groupe.membres || []).length > 3 && (
                  <div className="avatar-membre avatar-plus">
                    +{(groupe.membres || []).length - 3}
                  </div>
                )}
                <span className="membres-count">
                  {(groupe.membres || []).length} membres
                </span>
              </div>
              <div className="groupe-stats">
                <div className="stat-box">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Projets actifs</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Tâches faites</span>
                </div>
              </div>
              <div className="groupe-code">
                <span className="code-label">Code d'invitation :</span>
                <span className="code-valeur">{groupe.code_invitation}</span>
              </div>
            </div>
          ))}

          <div
            className="groupe-carte groupe-vide"
            onClick={() => {
              setShowModal(true);
              setOnglet("rejoindre");
            }}
          >
            <div className="vide-icon">◯</div>
            <p className="vide-text">Rejoindre un groupe</p>
          </div>
        </div>

        {/* PROJETS DU GROUPE */}
        {groupeActif && (
          <div className="groupe-projets">
            <div className="projets-header">
              <h2>Projets — {groupeActif.nom}</h2>
              <button
                className="btn-rejoindre"
                onClick={() => setShowProjetModal(true)}
              >
                + Nouveau projet
              </button>
            </div>

            {projetsGroupe.length === 0 ? (
              <p className="empty-msg">Aucun projet dans ce groupe</p>
            ) : (
              projetsGroupe.map((projet) => (
                <div
                  key={projet.id}
                  className="projet-carte"
                  onClick={() => setProjetActifGroupe(projet)}
                  style={{ cursor: "pointer" }}
                >
                  <p className="projet-nom">{projet.nom}</p>
                  <p className="projet-description">{projet.description}</p>
                </div>
              ))
            )}

            {projetActifGroupe && (
              <Kanban
                projetId={projetActifGroupe.id}
                projetNom={projetActifGroupe.nom}
                groupeId={groupeActif.id}
                onFermer={() => setProjetActifGroupe(null)}
              />
            )}
          </div>
        )}

        {/* MODAL CRÉER GROUPE */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-onglets">
                <button
                  className={`onglet ${onglet === "creer" ? "onglet-actif" : ""}`}
                  onClick={() => setOnglet("creer")}
                >
                  Créer
                </button>
                <button
                  className={`onglet ${onglet === "rejoindre" ? "onglet-actif" : ""}`}
                  onClick={() => setOnglet("rejoindre")}
                >
                  Rejoindre
                </button>
              </div>

              {onglet === "creer" && (
                <>
                  <h2 className="modal-title">Créer un groupe</h2>
                  <div className="modal-field">
                    <label>Nom du groupe *</label>
                    <input
                      type="text"
                      placeholder="Ex: Groupe Algo & Réseaux"
                      value={form.nom}
                      onChange={(e) =>
                        setForm({ ...form, nom: e.target.value })
                      }
                    />
                  </div>
                  <div className="modal-field">
                    <label>Cours</label>
                    <input
                      type="text"
                      placeholder="Ex: L3 Informatique — Pr. Dumont"
                      value={form.cours}
                      onChange={(e) =>
                        setForm({ ...form, cours: e.target.value })
                      }
                    />
                  </div>
                  <div className="modal-field">
                    <label>Emoji</label>
                    <input
                      type="text"
                      placeholder="Ex: 🎨"
                      value={form.emoji}
                      onChange={(e) =>
                        setForm({ ...form, emoji: e.target.value })
                      }
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      className="btn-annuler"
                      onClick={() => setShowModal(false)}
                    >
                      Annuler
                    </button>
                    <button
                      className="btn-rejoindre"
                      onClick={handleCreate}
                      disabled={loading}
                    >
                      {loading ? "Création..." : "Créer"}
                    </button>
                  </div>
                </>
              )}

              {onglet === "rejoindre" && (
                <>
                  <h2 className="modal-title">Rejoindre un groupe</h2>
                  <div className="modal-field">
                    <label>Code d'invitation</label>
                    <input
                      type="text"
                      placeholder="Ex: A1B2C3"
                      value={codeRejoindre}
                      onChange={(e) => setCodeRejoindre(e.target.value)}
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      className="btn-annuler"
                      onClick={() => setShowModal(false)}
                    >
                      Annuler
                    </button>
                    <button className="btn-rejoindre" onClick={handleRejoindre}>
                      Rejoindre
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* MODAL CRÉER PROJET */}
        {showProjetModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowProjetModal(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Nouveau projet</h2>
              <div className="modal-field">
                <label>Nom *</label>
                <input
                  type="text"
                  value={formProjet.nom}
                  onChange={(e) =>
                    setFormProjet({ ...formProjet, nom: e.target.value })
                  }
                  placeholder="Nom du projet"
                />
              </div>
              <div className="modal-field">
                <label>Description</label>
                <textarea
                  value={formProjet.description}
                  onChange={(e) =>
                    setFormProjet({
                      ...formProjet,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description..."
                />
              </div>
              <div className="modal-field">
                <label>Date limite</label>
                <input
                  type="date"
                  value={formProjet.dateLimite}
                  onChange={(e) =>
                    setFormProjet({ ...formProjet, dateLimite: e.target.value })
                  }
                />
              </div>
              <div className="modal-actions">
                <button
                  className="btn-annuler"
                  onClick={() => setShowProjetModal(false)}
                >
                  Annuler
                </button>
                <button className="btn-rejoindre" onClick={handleCreateProjet}>
                  Créer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Groupes;
