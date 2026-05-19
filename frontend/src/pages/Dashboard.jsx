import StatsCard from "../components/StatsCard"

function Dashboard() {

  const tasks = [

    {
      title: "Rapport UX",
      date: "Demain - 23h59",
      priority: "Urgent"
    },

    {
      title: "Présentation groupe",
      date: "Lundi prochain",
      priority: "Moyen"
    },

    {
      title: "Révisions React",
      date: "Vendredi",
      priority: "Normal"
    }

  ]

  function getBadgeClass(priority){

    if(priority === "Urgent"){
      return "red"
    }

    if(priority === "Moyen"){
      return "orange"
    }

    return "green"
  }

  return (

    <div className="dashboard">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <h1>StudySync Dashboard</h1>

          <p>
            Bienvenue Melek 👋
          </p>

        </div>

        <button className="notif-btn">
          🔔 3
        </button>

      </div>

      {/* STATS */}

      <div className="stats">

        <StatsCard
          title="Tâches"
          value="12"
          text="+2 cette semaine"
        />

        <StatsCard
          title="Complétées"
          value="34"
          text="74% progression"
        />

        <StatsCard
          title="Urgentes"
          value="3"
          text="À faire rapidement"
        />

        <StatsCard
          title="Projets"
          value="5"
          text="2 actifs"
        />

      </div>

      {/* GRID */}

      <div className="dashboard-grid">

        {/* LEFT */}

        <div>

          {/* TASKS */}

          <div className="tasks-section">

            <h2>Tâches prioritaires</h2>

            {

              tasks.map((task, index)=>(

                <div className="task" key={index}>

                  <div>

                    <h4>{task.title}</h4>

                    <p>{task.date}</p>

                  </div>

                  <span className={`badge ${getBadgeClass(task.priority)}`}>

                    {task.priority}

                  </span>

                </div>

              ))

            }

          </div>

          {/* PROGRESS */}

          <div className="progress-section">

            <h2>Progression</h2>

            <p>34 tâches sur 46 terminées</p>

            <div className="progress-bar">

              <div className="progress-fill"></div>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div>

          {/* CALENDAR */}

          <div className="calendar">

            <h2>Mai 2026</h2>

            <div className="calendar-grid">

              <div>Lu</div>
              <div>Ma</div>
              <div>Me</div>
              <div>Je</div>
              <div>Ve</div>
              <div>Sa</div>
              <div>Di</div>

              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>5</div>
              <div>6</div>
              <div>7</div>

              <div>8</div>
              <div>9</div>
              <div className="today">10</div>
              <div>11</div>
              <div>12</div>
              <div>13</div>
              <div>14</div>

              <div>15</div>
              <div>16</div>
              <div>17</div>
              <div>18</div>
              <div>19</div>
              <div>20</div>
              <div>21</div>

            </div>

          </div>

          {/* ACTIVITY */}

          <div className="activity">

            <h2>Activité récente</h2>

            <div className="activity-item">
              ✅ Tâche React terminée
            </div>

            <div className="activity-item">
              📁 Nouveau projet ajouté
            </div>

            <div className="activity-item">
              🔥 Deadline approche
            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default Dashboard