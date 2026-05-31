import { useEffect, useState } from "react";
import api from "../../Api.jsx";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Dashboard.css";
import Topbar from "../../components/Topbar/Topbar.jsx";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Étudiant" };

  const [stats, setStats] = useState({
    tachesEnCours: 0,
    tachesCompletees: 0,
    echeancesProches: 0,
    projetsActifs: 0,
  });

  const [projets, setProjets] = useState([]);
  const [tachesPrioritaires, setTachesPrioritaires] = useState([]);

  const getPriority = (task) => {
    let score = 0;

    const today = new Date();

    // deadline
    if (task.deadline) {
      const dueDate = new Date(task.deadline);

      const diffTime = dueDate - today;

      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 2) {
        score += 3;
      } else if (diffDays <= 7) {
        score += 2;
      }
    }

    // priorité manuelle choisie
    if (task.priorite === "Haute") {
      score += 3;
    } else if (task.priorite === "Moyenne") {
      score += 2;
    } else {
      score += 1;
    }

    if (score >= 5) {
      return "Haute";
    }

    if (score >= 3) {
      return "Moyenne";
    }

    return "Basse";
  };
  useEffect(() => {
    api
      .get("/api/projets")
      .then(async (res) => {
        const projetsData = Array.isArray(res.data) ? res.data : [];
        let tachesEnCours = 0;
        let tachesCompletees = 0;
        let toutesLesTaches = [];

        const projetsAvecAvancement = await Promise.all(
          projetsData.map(async (projet) => {
            const tachesRes = await api.get(`/api/projets/${projet.id}/taches`);
            const taches = tachesRes.data;
            tachesEnCours += taches.filter((t) => t.statut !== "done").length;
            tachesCompletees += taches.filter(
              (t) => t.statut === "done",
            ).length;
            toutesLesTaches = [
              ...toutesLesTaches,
              ...taches.map((t) => ({ ...t, projetNom: projet.nom })),
            ];
            const total = taches.length;
            const terminees = taches.filter((t) => t.statut === "done").length;
            const avancement =
              total > 0 ? Math.round((terminees / total) * 100) : 0;
            return { ...projet, avancement };
          }),
        );
        setProjets(projetsAvecAvancement);

        const ordrePriorite = {
          Haute: 3,
          Moyenne: 2,
          Basse: 1,
        };

        const tachesTriees = toutesLesTaches
          .filter((t) => t.statut !== "done")
          .sort((a, b) => {
            return (
              ordrePriorite[getPriority(b)] - ordrePriorite[getPriority(a)]
            );
          })
          .slice(0, 4);

        setTachesPrioritaires(tachesTriees);
        setStats({
          tachesEnCours,
          tachesCompletees,
          echeancesProches: toutesLesTaches.filter(
            (t) => t.priorite === "Haute" && t.statut !== "done",
          ).length,
          projetsActifs: projetsData.length,
        });
      })
      .catch((err) => console.error(err));
  }, []);
  const terminerTache = async (id) => {
    try {
      await api.patch(`/api/taches/${id}/statut`, {
        statut: "done",
      });

      setTachesPrioritaires((prev) => prev.filter((t) => t.id !== id));

      window.dispatchEvent(new Event("refreshTasks"));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="layout">
      <Sidebar />
      <div className="dashboard">
        {/* TOPBAR */}
        <Topbar />

        {/* HEADER */}
        <div className="dashboard-header">
          <h1>Bonjour, {user.name}</h1>
          <p className="dashboard-date">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <span className="stat-icon">📋</span>
            <h2>{stats.tachesEnCours}</h2>
            <p>Tâches en cours</p>
          </div>
          <div className="stat-card stat-green">
            <span className="stat-icon">✅</span>
            <h2>{stats.tachesCompletees}</h2>
            <p>Tâches complétées</p>
          </div>
          <div className="stat-card stat-orange">
            <span className="stat-icon">⏰</span>
            <h2>{stats.echeancesProches}</h2>
            <p>Échéances proches</p>
          </div>
          <div className="stat-card stat-purple">
            <span className="stat-icon">🎯</span>
            <h2>{stats.projetsActifs}</h2>
            <p>Projets actifs</p>
          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="dashboard-main">
          {/* TÂCHES PRIORITAIRES */}
          <div className="dashboard-section taches-section">
            <h3 className="section-title">TÂCHES PRIORITAIRES</h3>
            {tachesPrioritaires.length === 0 ? (
              <p className="empty-msg">Aucune tâche en cours</p>
            ) : (
              tachesPrioritaires.map((tache) => (
                <div key={tache.id} className="tache-item">
                  <button
                    className="tache-check"
                    onClick={() => terminerTache(tache.id)}
                  ></button>
                  <div className="tache-info">
                    <p className="tache-titre">{tache.titre}</p>
                    <div className="tache-meta">
                      <span className="tache-projet">📁 {tache.projetNom}</span>
                      <span
                        className={`tache-priorite ${tache.priorite === "Haute" ? "urgent" : tache.priorite === "Moyenne" ? "moyen" : "bas"}`}
                      >
                        {tache.priorite === "Haute"
                          ? "Urgent"
                          : tache.priorite === "Moyenne"
                            ? "Moyen"
                            : "Bas"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PROJETS ACTIFS */}
          <div className="dashboard-section projets-section">
            <h3 className="section-title">Projets actifs</h3>
            {projets.slice(0, 2).map((projet) => (
              <div key={projet.id} className="projet-card">
                <p className="projet-nom">{projet.nom}</p>
                <p className="projet-desc">{projet.description}</p>
                <div className="progression">
                  <div className="progression-header">
                    <span>Avancement</span>
                    <span>{projet.avancement || 0}%</span>
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

          {/* PROGRESSION */}
          <div className="dashboard-section">
            <div className="progression-header-title">
              <h3 className="section-title">PROGRESSION</h3>
              <span className="progression-pct-global">
                {stats.tachesCompletees + stats.tachesEnCours > 0
                  ? Math.round(
                      (stats.tachesCompletees /
                        (stats.tachesCompletees + stats.tachesEnCours)) *
                        100,
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="progression-item">
              <div className="progression-label">
                <span>Tâches terminées</span>
                <span>
                  {stats.tachesCompletees} /{" "}
                  {stats.tachesCompletees + stats.tachesEnCours}
                </span>
              </div>
              <div className="barre-fond">
                <div
                  className="barre-remplie barre-purple"
                  style={{
                    width: `${stats.tachesCompletees + stats.tachesEnCours > 0 ? Math.round((stats.tachesCompletees / (stats.tachesCompletees + stats.tachesEnCours)) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className="progression-item">
              <div className="progression-label">
                <span>Projets actifs</span>
                <span>{stats.projetsActifs}</span>
              </div>
              <div className="barre-fond">
                <div
                  className="barre-remplie barre-blue"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* ÉCHÉANCES */}
          <div className="dashboard-section">
            <h3 className="section-title">Échéances</h3>
            {projets.length === 0 ? (
              <p className="empty-msg">Aucune échéance</p>
            ) : (
              projets.map((projet) => (
                <div key={projet.id} className="echeance-item">
                  <div className="echeance-date">
                    <span className="echeance-jour">
                      {projet.dateLimite
                        ? new Date(projet.dateLimite).getDate()
                        : "--"}
                    </span>
                    <span className="echeance-mois">
                      {projet.dateLimite
                        ? new Date(projet.dateLimite)
                            .toLocaleDateString("fr-FR", { month: "short" })
                            .toUpperCase()
                        : ""}
                    </span>
                  </div>
                  <div className="echeance-info">
                    <p className="echeance-nom">{projet.nom}</p>
                    <p className="echeance-desc">{projet.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
