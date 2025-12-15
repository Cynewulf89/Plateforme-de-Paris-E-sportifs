import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../App.css'

const Landing = React.memo(() => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <div className="App">
      <header className="hero">
        <h1>Plateforme de Paris E-sportifs</h1>
        <p>La révolution des paris e-sportifs à Paris ! Pariez sur vos équipes favorites et vivez l'adrénaline des compétitions.</p>
        {isAuthenticated && (
          <button className="cta-button" onClick={() => navigate('/betting')}>Commencer à Parier</button>
        )}
        {!isAuthenticated && (
          <div className="auth-prompt">
            <p>Connectez-vous pour commencer à parier !</p>
            <div className="auth-buttons">
              <button className="login-button" onClick={() => navigate('/login')}>Se connecter</button>
              <button className="register-button" onClick={() => navigate('/register')}>S'inscrire</button>
            </div>
          </div>
        )}
      </header>

      <section className="features">
        <h2>Pourquoi Nous Choisir ?</h2>
        <div className="feature-grid">
          <div className="feature">
            <h3>Équipes Locales</h3>
            <p>Soutenez les équipes e-sportives parisiennes et suivez leurs performances.</p>
          </div>
          <div className="feature">
            <h3>Paris Sécurisés</h3>
            <p>Transactions sécurisées et gains garantis.</p>
          </div>
          <div className="feature">
            <h3>Résultats en Direct</h3>
            <p>Suivez les matchs en temps réel et consultez vos gains.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Plateforme de Paris E-sportifs. Tous droits réservés.</p>
      </footer>
    </div>
  )
})

export default Landing