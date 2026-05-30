import { useState, useEffect } from 'react'
import api from '../Api.jsx'

export function useTaches() {
  const [taches, setTaches] = useState([])
  const [projets, setProjets] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    try {
      const projetsRes = await api.get('/api/projets')
      const projetsData = Array.isArray(projetsRes.data) ? projetsRes.data : []

      let toutesLesTaches = []
      const projetsAvecAvancement = await Promise.all(
        projetsData.map(async (projet) => {
          const tachesRes = await api.get(`/api/projets/${projet.id}/taches`)
          const taches = tachesRes.data
          toutesLesTaches = [...toutesLesTaches, ...taches.map(t => ({ ...t, projetNom: projet.nom, projetId: projet.id }))]
          const total = taches.length
          const terminees = taches.filter(t => t.statut === 'done').length
          return { ...projet, avancement: total > 0 ? Math.round((terminees / total) * 100) : 0 }
        })
      )

      setProjets(projetsAvecAvancement)
      setTaches(toutesLesTaches)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
useEffect(() => {
  fetchAll()

  const handleRefresh = () => {
    fetchAll()
  }

  window.addEventListener(
    'refreshTasks',
    handleRefresh
  )

  return () => {
    window.removeEventListener(
      'refreshTasks',
      handleRefresh
    )
  }
}, [])

  return { taches, projets, loading, refresh: fetchAll }
}