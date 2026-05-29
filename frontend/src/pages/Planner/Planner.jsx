
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

 function couleurParPriorite(priorite) {
  if (priorite === 'Haute') return '#ef4444'   // rouge
  if (priorite === 'Moyenne') return '#f59e0b' // orange
  return '#22c55e'                              // vert
}
function Planner() {

    const [events, setEvents] = useState([])

  // ✅ Récupérer toutes les tâches de tous les projets
  useEffect(() => {
    const fetchTaches = async () => {
      try {
        // 1. Récupérer tous les projets
        const projetsRes = await api.get('/api/projets')
        const projets = Array.isArray(projetsRes.data) ? projetsRes.data : []

        // 2. Pour chaque projet, récupérer ses tâches
        const toutesLesTaches = []
        for (const projet of projets) {
          const tachesRes = await api.get(`/api/projets/${projet.id}/taches`)
          const taches = tachesRes.data
          taches.forEach(tache => {
            // On crée un event seulement si la tâche n'est pas terminée
            if (tache.statut !== 'done' && projet.dateLimite) {
              toutesLesTaches.push({
                id: String(tache.id),
                title: `${tache.titre} — ${projet.nom}`,
                start: projet.dateLimite.slice(0, 10), // format YYYY-MM-DD
                end: projet.dateLimite.slice(0, 10),
                // La couleur dépend de la priorité
                calendarId: tache.priorite === 'Haute' ? 'urgent' 
                          : tache.priorite === 'Moyenne' ? 'moyen' 
                          : 'normal'
              })
            }
          })
        }
        setEvents(toutesLesTaches)
      } catch (err) {
        console.error('Erreur chargement tâches planner:', err)
      }
    }

    fetchTaches()
  }, [])
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
 