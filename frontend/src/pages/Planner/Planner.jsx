import { useState, useEffect } from "react";
import { useTaches } from "../../hooks/useTaches.js";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewWeekAgenda,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Api from "../../Api";
import "./planner.css";

function Planner() {
  const { taches, projets, refresh } = useTaches();
  const events = taches
    .map((tache) => {
      const projet = projets.find((p) => p.id === tache.projetId);
      const date = projet?.dateLimite || tache.deadline;

      if (!date) return null;

      const safeDate = new Date(date);
      if (isNaN(safeDate)) return null;

      return {
        id: String(tache.id),
        title: tache.titre,
        start: safeDate.toISOString().slice(0, 10),
        end: safeDate.toISOString().slice(0, 10),
        calendarId:
          tache.priorite === "Haute"
            ? "urgent"
            : tache.priorite === "Moyenne"
              ? "moyen"
              : "normal",
      };
    })
    .filter(Boolean);
  console.log("TACHES", taches);
  console.log("PROJETS", projets);
  console.log("EVENTS", events);
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeekAgenda(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    defaultView: "week",
    events: events,
    calendars: {
      urgent: {
        colorName: "urgent",
        lightColors: {
          main: "#ef4444",
          container: "#fef2f2",
          onContainer: "#7f1d1d",
        },
      },
      moyen: {
        colorName: "moyen",
        lightColors: {
          main: "#f59e0b",
          container: "#fffbeb",
          onContainer: "#78350f",
        },
      },
      normal: {
        colorName: "normal",
        lightColors: {
          main: "#22c55e",
          container: "#f0fdf4",
          onContainer: "#14532d",
        },
      },
    },
  });

  return (
    <div className="layout">
      <Sidebar />
      <div className="planner-container">
        <h1 className="title">Planner</h1>
        <p className="subtitle">Planifie et visualise ton emploi du temps</p>
        <div className="calendar-wrapper">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      </div>
    </div>
  );
}

export default Planner;
