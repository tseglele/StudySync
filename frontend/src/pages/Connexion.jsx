import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../Api'
import './Connexion.css'

function Connexion() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/auth/login', { email, password })

      // On stocke le token et l'utilisateur
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // On redirige vers le dashboard
      navigate('/dashboard')

    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  navigate('/login')
    }

  return (
  <div className="connexion-wrapper">
    <div className="connexion-card">
      <div className="connexion-logo">
        <div className="logo-icon">📚</div>
        <span className="logo-name">StudySync</span>
      </div>
      <h2 className="connexion-title">Bon retour !</h2>
      <p className="connexion-subtitle">Connecte-toi pour accéder à ton espace.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Adresse Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@universite.fr" required />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        <button className="btn-submit" type="submit">Se connecter →</button>
      </form>
      <p className="connexion-footer">Pas encore de compte ? <Link to="/register">Créer un compte</Link></p>
    </div>
  </div>
)
}

export default Connexion