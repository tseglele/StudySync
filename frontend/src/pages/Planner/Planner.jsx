import { useTaches } from "../../hooks/useTaches.js";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewWeekAgenda,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import "./planner.css";
import "@schedule-x/theme-default/dist/index.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";

function CalendarView({ events }) {
  const calendar = useCalendarApp({
    views: [
      createViewMonthGrid(),
      createViewWeek(),
      createViewWeekAgenda(),
      createViewMonthAgenda(),
      createViewDay(),
    ],
    defaultView: "month-grid",
    events: events,
    calendars: {
      urgent: {
        colorName: "urgent",
        lightColors: {
          main: "#ef4444",
          container: "#fca5a5",
          onContainer: "#7f1d1d",
        },
      },
      moyen: {
        colorName: "moyen",
        lightColors: {
          main: "#f59e0b",
          container: "#fcd34d",
          onContainer: "#78350f",
        },
      },
      normal: {
        colorName: "normal",
        lightColors: {
          main: "#22c55e",
          container: "#86efac",
          onContainer: "#14532d",
        },
      },
      projet: {
        colorName: "projet",
        lightColors: {
          main: "#7c6af7",
          container: "#c4b5fd",
          onContainer: "#2e1065",
        },
      },
    },
  });

  return <ScheduleXCalendar calendarApp={calendar} />;
}

function Planner() {
  const { taches, projets, loading } = useTaches();

  // Events des PROJETS — plus grands, violet
  const eventsProjet = projets
    .filter((p) => p.dateLimite)
    .map((projet) => {
      const dateStr =
        typeof projet.dateLimite === "string"
          ? projet.dateLimite.slice(0, 10)
          : new Date(projet.dateLimite).toISOString().slice(0, 10);

      let plainDate;
      try {
        plainDate = Temporal.PlainDate.from(dateStr);
      } catch {
        return null;
      }

      return {
        id: `projet-${projet.id}`,
        title: `📁 ${projet.nom}`,
        start: plainDate,
        end: plainDate,
        calendarId: "projet",
      };
    })
    .filter(Boolean);

  // Events des TÂCHES — colorées par priorité
  const eventsTache = taches
    .filter((tache) => !tache.status || tache.status !== "done")
    .map((tache) => {
      const projet = projets.find((p) => p.id === tache.projetId);
      const dateRaw = tache.deadline || projet?.dateLimite;

      if (!dateRaw) return null;

      const dateStr =
        typeof dateRaw === "string"
          ? dateRaw.slice(0, 10)
          : new Date(dateRaw).toISOString().slice(0, 10);

      let plainDate;
      try {
        plainDate = Temporal.PlainDate.from(dateStr);
      } catch {
        return null;
      }

      return {
        id: `tache-${tache.id}`,
        title: `✓ ${tache.titre}`,
        start: plainDate,
        end: plainDate,
        calendarId:
          tache.priorite === "Haute"
            ? "urgent"
            : tache.priorite === "Moyenne"
              ? "moyen"
              : "normal",
      };
    })
    .filter(Boolean);

  const events = [...eventsProjet, ...eventsTache];

  return (
    <div className="layout">
      <Topbar />
      <Sidebar />
      <div className="planner-container">
        <h1 className="title">Planner</h1>
        <p className="subtitle">Planifie et visualise ton emploi du temps</p>

        {/* Légende */}
        <div className="planner-legende">
          <span className="legende-item legende-projet">📁 Projet</span>
          <span className="legende-item legende-urgent">🔴 Urgent</span>
          <span className="legende-item legende-moyen">🟡 Moyen</span>
          <span className="legende-item legende-normal">🟢 Normal</span>
        </div>

        <div className="calendar-wrapper">
          {loading ? (
            <p
              style={{ color: "#8b8a9e", padding: "40px", textAlign: "center" }}
            >
              Chargement...
            </p>
          ) : (
            <CalendarView key={events.length} events={events} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Planner;
