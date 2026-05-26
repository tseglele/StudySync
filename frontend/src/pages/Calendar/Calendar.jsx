/*
=======================================================
  CalendarPage.jsx — Structure visuelle SEULEMENT
  
  📁 Où le mettre : client/src/pages/CalendarPage.jsx
=======================================================
*/

import React from 'react'


export default function CalendarPage() {

  /*
    STRUCTURE DE CETTE PAGE :

    <div class="calendar-page">
      <div class="calendar-header">       ← titre + navigation mois
      <div class="calendar-contenu">      ← grille principale
        <div class="colonne-calendrier">  ← la grille des jours
        <div class="colonne-echeances">   ← les échéances du jour sélectionné
  */

  return (

    <div className="calendar-page">


      {/* ================================================
          ZONE 1 : EN-TÊTE avec navigation du mois
      ================================================ */}
      <div className="calendar-header">

        <div className="header-titre">
          <p className="header-eyebrow">Planning</p>
          <h1 className="header-h1">Calendrier</h1>
        </div>

        {/* Navigation pour changer de mois */}
        <div className="mois-nav">
          <button className="nav-btn">←</button>
          <span className="mois-titre">Mai 2025</span>
          <button className="nav-btn">→</button>
        </div>

      </div>


      {/* ================================================
          ZONE 2 : CONTENU PRINCIPAL
          Grille 2 colonnes : calendrier + liste du jour
      ================================================ */}
      <div className="calendar-contenu">


        {/* ── COLONNE GAUCHE : la grille du calendrier ── */}
        <div className="colonne-calendrier">

          {/* La carte qui entoure tout le calendrier */}
          <div className="cal-carte">

            {/* Les 7 jours de la semaine en en-tête */}
            <div className="cal-jours-semaine">
              <span>Lun</span>
              <span>Mar</span>
              <span>Mer</span>
              <span>Jeu</span>
              <span>Ven</span>
              <span>Sam</span>
              <span>Dim</span>
            </div>

            {/* La grille des jours — 7 colonnes × 5 lignes */}
            <div className="cal-grille">

              {/*
                Chaque jour a une div avec des classes différentes selon son état :
                - .cal-jour           → un jour normal
                - .cal-jour-autre     → appartient au mois précédent/suivant (grisé)
                - .cal-jour-auj       → aujourd'hui (mis en valeur)
                - .cal-jour-select    → le jour cliqué (sélectionné)
                - .cal-jour-event     → a un point de couleur (une tâche ce jour)
              */}

              {/* Semaine 1 — quelques jours du mois précédent */}
              <div className="cal-jour cal-jour-autre">28</div>
              <div className="cal-jour cal-jour-autre">29</div>
              <div className="cal-jour cal-jour-autre">30</div>
              <div className="cal-jour">1</div>
              <div className="cal-jour">2</div>
              <div className="cal-jour cal-jour-weekend">3</div>
              <div className="cal-jour cal-jour-weekend">4</div>

              {/* Semaine 2 */}
              <div className="cal-jour">5</div>
              <div className="cal-jour">6</div>
              <div className="cal-jour">7</div>
              <div className="cal-jour">8</div>
              <div className="cal-jour cal-jour-event">
                9
                {/* Le petit point sous le chiffre = il y a une tâche ce jour */}
                <span className="cal-point cal-point-orange"></span>
              </div>
              <div className="cal-jour cal-jour-weekend">10</div>
              <div className="cal-jour cal-jour-weekend">11</div>

              {/* Semaine 3 */}
              <div className="cal-jour">12</div>
              <div className="cal-jour">13</div>
              {/* Aujourd'hui */}
              <div className="cal-jour cal-jour-auj">14</div>
              <div className="cal-jour cal-jour-event cal-jour-select">
                15
                <span className="cal-point cal-point-rouge"></span>
              </div>
              <div className="cal-jour cal-jour-event">
                16
                <span className="cal-point cal-point-orange"></span>
              </div>
              <div className="cal-jour cal-jour-weekend">17</div>
              <div className="cal-jour cal-jour-weekend">18</div>

              {/* Semaine 4 */}
              <div className="cal-jour cal-jour-event">
                19
                <span className="cal-point cal-point-violet"></span>
              </div>
              <div className="cal-jour cal-jour-event">
                20
                <span className="cal-point cal-point-violet"></span>
              </div>
              <div className="cal-jour">21</div>
              <div className="cal-jour cal-jour-event">
                22
                <span className="cal-point cal-point-orange"></span>
              </div>
              <div className="cal-jour">23</div>
              <div className="cal-jour cal-jour-weekend">24</div>
              <div className="cal-jour cal-jour-weekend">25</div>

              {/* Semaine 5 */}
              <div className="cal-jour">26</div>
              <div className="cal-jour">27</div>
              <div className="cal-jour">28</div>
              <div className="cal-jour">29</div>
              <div className="cal-jour">30</div>
              <div className="cal-jour cal-jour-weekend">31</div>
              <div className="cal-jour cal-jour-autre">1</div>

            </div>
            {/* fin .cal-grille */}

            {/* Légende des couleurs en bas */}
            <div className="cal-legende">
              <div className="legende-item">
                <span className="cal-point cal-point-rouge"></span>
                <span>Urgent</span>
              </div>
              <div className="legende-item">
                <span className="cal-point cal-point-orange"></span>
                <span>Moyen</span>
              </div>
              <div className="legende-item">
                <span className="cal-point cal-point-violet"></span>
                <span>Normal</span>
              </div>
            </div>

          </div>
          {/* fin .cal-carte */}

        </div>
        {/* fin .colonne-calendrier */}


        {/* ── COLONNE DROITE : tâches du jour sélectionné ── */}
        <div className="colonne-echeances">

          {/* Titre de la colonne */}
          <div className="echeances-header">
            <h2 className="echeances-titre">15 mai</h2>
            <span className="echeances-sous">1 échéance</span>
          </div>

          {/* Une tâche du jour — même structure que dans PlannerPage */}
          <div className="echeance-carte">
            <div className="echeance-heure">23:59</div>
            <div className="echeance-corps">
              <p className="echeance-nom">Rapport de projet distribué</p>
              <p className="echeance-cours">📚 Algo & Réseaux</p>
            </div>
            <span className="badge-priorite badge-rouge">Urgent</span>
          </div>

          {/* Séparateur visuel */}
          <div className="separateur"></div>

          {/* Les prochaines échéances (liste rapide) */}
          <p className="sidebar-titre" style={{ marginBottom: '12px' }}>Prochaines échéances</p>

          {/*
            Une prochaine échéance =
            [date colorée] [trait] [nom + cours]
          */}
          <div className="prochaine-ligne">
            <div className="prochaine-date">
              <span className="prochaine-jour" style={{ color: 'var(--rouge)' }}>15</span>
              <span className="prochaine-mois">mai</span>
            </div>
            <div className="prochaine-trait"></div>
            <div className="prochaine-info">
              <p className="prochaine-nom">Rapport distribué</p>
              <p className="prochaine-cours">Algo & Réseaux</p>
            </div>
          </div>

          <div className="prochaine-ligne">
            <div className="prochaine-date">
              <span className="prochaine-jour" style={{ color: 'var(--orange)' }}>16</span>
              <span className="prochaine-mois">mai</span>
            </div>
            <div className="prochaine-trait"></div>
            <div className="prochaine-info">
              <p className="prochaine-nom">Séries mathématiques</p>
              <p className="prochaine-cours">Analyse numérique</p>
            </div>
          </div>

          <div className="prochaine-ligne">
            <div className="prochaine-date">
              <span className="prochaine-jour">19</span>
              <span className="prochaine-mois">mai</span>
            </div>
            <div className="prochaine-trait"></div>
            <div className="prochaine-info">
              <p className="prochaine-nom">Présentation UX</p>
              <p className="prochaine-cours">Design & Interface</p>
            </div>
          </div>

        </div>
        {/* fin .colonne-echeances */}


      </div>
      {/* fin .calendar-contenu */}


    </div>
    /* fin .calendar-page */

  )
}