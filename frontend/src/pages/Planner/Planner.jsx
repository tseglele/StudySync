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
    locale: "fr-FR",
    views: [
      createViewMonthGrid(),
      createViewWeek(),
      createViewWeekAgenda(),
      createViewMonthAgenda(),
      createViewDay(),
    ],
    defaultView: "month-grid",
    events,
    calendars: {
      projet_duree: {
        colorName: "projet_duree",
        lightColors: {
          main: "#7c6af7",
          container: "#ede9fe",
          onContainer: "#2e1065",
        },
      },
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
    },
  });

  return <ScheduleXCalendar calendarApp={calendar} />;
}

function toPlainDate(raw) {
  if (!raw) return null;
  try {
    const str = typeof raw === "string" ? raw : new Date(raw).toISOString();
    return Temporal.PlainDate.from(str.slice(0, 10));
  } catch {
    return null;
  }
}

function Planner() {
  const { taches, projets, loading } = useTaches();

  const eventsProjet = projets.flatMap((projet) => {
    const debut = toPlainDate(projet.createdAt);
    const fin = toPlainDate(projet.dateLimite);
    if (!debut || !fin) return [];
    // Temporal.PlainDate.compare : 0 ou positif = pas de durée
    if (Temporal.PlainDate.compare(debut, fin) >= 0) return [];

    return [
      {
        id: `projet-${projet.id}`,
        title: `📁 ${projet.nom}`,
        start: debut,
        end: fin,
        calendarId: "projet_duree",
      },
    ];
  });

  const eventsTache = taches
    .filter((t) => t.statut !== "done")
    .flatMap((tache) => {
      const projet = projets.find((p) => p.id === tache.projetId);
      const date =
        toPlainDate(tache.deadline) ?? toPlainDate(projet?.dateLimite);
      if (!date) return [];

      return [
        {
          id: `tache-${tache.id}`,
          title: `✓ ${tache.titre}`,
          start: date,
          end: date,
          calendarId:
            tache.priorite === "Haute"
              ? "urgent"
              : tache.priorite === "Moyenne"
                ? "moyen"
                : "normal",
        },
      ];
    });
  const events = [...eventsProjet, ...eventsTache];
  return (
    <div className="layout">
      <Topbar />
      <Sidebar />
      <div className="planner-container">
        <h1 className="title">Planner</h1>
        <p className="subtitle">Planifie et visualise ton emploi du temps</p>

        <div className="planner-legende">
          <span className="legende-item legende-projet">📁 Durée projet</span>
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
