
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
import "./planner.css";
 
function Planner() {
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeekAgenda(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    defaultView: "week",
    events: [
      {
        id: "1",
        title: "Rapport distribué — rendu",
        start: Temporal.ZonedDateTime.from(
          "2026-05-28T10:00:00+02:00[Europe/Paris]"
        ),
        end: Temporal.ZonedDateTime.from(
          "2026-05-28T12:00:00+02:00[Europe/Paris]"
        ),
      },
    ],
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
 