import { useState } from 'react'
import './connexion.css'

function Connexion() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')



    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div className="connexion-container">

            <div >
                <h2>Connexion</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Mot de passe:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Se connecter</button>
                </form>
            </div>
        </div>
    )
}

export default Connexion