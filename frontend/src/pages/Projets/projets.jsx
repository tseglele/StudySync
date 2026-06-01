import { useState, useEffect } from "react";
import api from "../../Api.jsx";
import Kanban from "../../components/Kanban/Kanban";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar.jsx";
import "./projets.css";

function Projets() {
  const [projets, setProjets] = useState([]);
  const [projetActif, setProjetActif] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [projetEnEdition, setProjetEnEdition] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    description: "",
    dateLimite: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chargerProjets();
  }, []);

  const chargerProjets = async () => {
    try {
      const res = await api.get("/api/projets");
      const projetsData = res.data?.projets || res.data?.data || res.data;
      const liste = Array.isArray(projetsData) ? projetsData : [];

      const projetsAvecAvancement = await Promise.all(
        liste.map(async (projet) => {
          try {
            const tachesRes = await api.get(`/api/projets/${projet.id}/taches`);
            const taches = Array.isArray(tachesRes.data) ? tachesRes.data : [];
            const total = taches.length;
            const terminees = taches.filter((t) => t.statut === "done").length;
            const avancement =
              total > 0 ? Math.round((terminees / total) * 100) : 0;
            return { ...projet, avancement };
          } catch {
            return { ...projet, avancement: 0 };
          }
        }),
      );
      setProjets(projetsAvecAvancement);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshAvancement = async (projetId) => {
    try {
      const tachesRes = await api.get(`/api/projets/${projetId}/taches`);
      const taches = Array.isArray(tachesRes.data) ? tachesRes.data : [];
      const total = taches.length;
      const terminees = taches.filter((t) => t.statut === "done").length;
      const avancement = total > 0 ? Math.round((terminees / total) * 100) : 0;
      setProjets((prev) =>
        prev.map((p) => (p.id === projetId ? { ...p, avancement } : p)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const ouvrirCreation = () => {
    setProjetEnEdition(null);
    setForm({ nom: "", description: "", dateLimite: "" });
    setShowModal(true);
  };

  const ouvrirEdition = (e, projet) => {
    e.stopPropagation();
    setProjetEnEdition(projet);
    setForm({
      nom: projet.nom,
      description: projet.description || "",
      dateLimite: projet.dateLimite
        ? new Date(projet.dateLimite).toISOString().slice(0, 10)
        : "",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.nom) return;
    setLoading(true);
    try {
      if (projetEnEdition) {
        const res = await api.put(`/api/projets/${projetEnEdition.id}`, form);
        setProjets((prev) =>
          prev.map((p) =>
            p.id === projetEnEdition.id
              ? { ...res.data, avancement: p.avancement }
              : p,
          ),
        );
      } else {
        const res = await api.post("/api/projets", form);
        setProjets((prev) => [...prev, { ...res.data, avancement: 0 }]);
      }
      setShowModal(false);
      setForm({ nom: "", description: "", dateLimite: "" });
      setProjetEnEdition(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, projetId) => {
    e.stopPropagation();
    if (!confirm("Supprimer ce projet et toutes ses tâches ?")) return;
    try {
      await api.delete(`/api/projets/${projetId}`);
      setProjets((prev) => prev.filter((p) => p.id !== projetId));
      if (projetActif?.id === projetId) setProjetActif(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page">
      <Topbar />
      <Sidebar />
      <h1 className="page-title">Mes Projets</h1>
      <p className="page-sub">Suivi de tes projets</p>

      <div className="page-meta">
        <span>{projets.length} projets actifs</span>
        <button className="btn-rejoindre" onClick={ouvrirCreation}>
          + Nouveau projet
        </button>
      </div>

      <div className="projets-liste">
        {projets.map((projet) => (
          <div
            key={projet.id}
            className="projet-carte"
            onClick={() => setProjetActif(projet)}
            style={{ cursor: "pointer" }}
          >
            <div className="projet-header">
              <p className="projet-nom">{projet.nom}</p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span className="projet-date">
                  📅{" "}
                  {projet.dateLimite
                    ? new Date(projet.dateLimite).toLocaleDateString("fr-FR")
                    : "—"}
                </span>
                <button
                  className="btn-edit"
                  onClick={(e) => ouvrirEdition(e, projet)}
                  title="Modifier"
                >
                  ✏️
                </button>
                <button
                  className="btn-delete"
                  onClick={(e) => handleDelete(e, projet.id)}
                  title="Supprimer"
                >
                  ❌
                </button>
              </div>
            </div>

            <p className="projet-description">{projet.description}</p>

            <div className="progression">
              <div className="progression-header">
                <span>Avancement</span>
                <span className="progression-pct">
                  {projet.avancement || 0}%
                </span>
              </div>
              <div className="barre-fond">
                <div
                  className="barre-remplie"
                  style={{ width: `${projet.avancement || 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="kanban-section">
        {projetActif ? (
          <Kanban
            projetId={projetActif.id}
            projetNom={projetActif.nom}
            onFermer={() => setProjetActif(null)}
            onTacheUpdate={() => refreshAvancement(projetActif.id)}
          />
        ) : (
          <div className="kanban-placeholder">
            <h3>Sélectionne un projet</h3>
            <p>Clique sur un projet pour afficher son Kanban</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {projetEnEdition ? "Modifier le projet" : "Nouveau projet"}
            </h2>
            <div className="modal-field">
              <label>Nom du projet *</label>
              <input
                type="text"
                placeholder="Ex: Refonte UI Dashboard"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />
            </div>
            <div className="modal-field">
              <label>Description</label>
              <textarea
                placeholder="Description du projet..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="modal-field">
              <label>Date limite</label>
              <input
                type="date"
                value={form.dateLimite}
                onChange={(e) =>
                  setForm({ ...form, dateLimite: e.target.value })
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
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "..." : projetEnEdition ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projets;
