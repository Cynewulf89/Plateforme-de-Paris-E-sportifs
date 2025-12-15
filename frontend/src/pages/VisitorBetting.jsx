import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../utils/api'
import io from 'socket.io-client'

function VisitorBetting() {
  const [matches, setMatches] = useState([])
  const [bets, setBets] = useState([])
  const [selectedMatch, setSelectedMatch] = useState('')
  const [amount, setAmount] = useState('')
  const [prediction, setPrediction] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isAuthenticated, user, updateBalance } = useAuth()
  const { addNotification } = useNotification()
  const navigate = useNavigate()

  const loadBets = async () => {
    if (isAuthenticated && user) {
      try {
        const allBets = await apiRequest('/bets');
        const userBets = allBets.filter(bet => bet.userId === user.id);
        setBets(userBets);
      } catch (error) {
        console.error('Erreur lors du chargement des paris:', error);
      }
    }
  };

  useEffect(() => {
    // Load open matches
    const loadMatches = async () => {
      try {
        const allMatches = await apiRequest('/matches');
        // Filter open matches (not finished)
        const openMatches = allMatches.filter(match => match.status !== 'finished');
        setMatches(openMatches);
      } catch (error) {
        console.error('Erreur lors du chargement des matchs:', error);
      }
    };

    loadMatches()
    loadBets()
  }, [isAuthenticated, user])

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const socket = io('http://localhost:5000')

    socket.on('betsResolved', (data) => {
      if (data.userId === user.id) {
        loadBets()
      }
    })

    socket.on('balanceUpdated', (data) => {
      if (data.userId === user.id) {
        updateBalance(data.newBalance)
      }
    })

    return () => {
      socket.off('betsResolved')
      socket.off('balanceUpdated')
      socket.disconnect()
    }
  }, [isAuthenticated, user])

  const placeBet = async () => {
    if (!isAuthenticated) {
      setError('Veuillez vous connecter pour parier')
      return
    }

    if (!selectedMatch || !amount || !prediction) {
      setError('Veuillez remplir tous les champs')
      return
    }

    const betAmount = parseFloat(amount)
    if (betAmount <= 0) {
      setError('Le montant doit être positif')
      return
    }

    if (betAmount > (user?.balance || 0)) {
      setError('Solde insuffisant')
      return
    }

    setLoading(true)
    setError('')

    try {
      const match = matches.find(m => m.id == selectedMatch)
      const odds = match.odds[prediction]

      const newBet = {
        userId: user?.id,
        matchId: selectedMatch,
        matchName: `${match.team1} vs ${match.team2}`,
        amount: betAmount,
        prediction,
        odds,
        potentialGain: (betAmount * odds).toFixed(2)
      }

      const savedBet = await apiRequest('/bets', {
        method: 'POST',
        body: JSON.stringify(newBet),
      });
      setBets([...bets, savedBet]);
      
      // Deduct from balance
      await updateBalance(user.balance - betAmount);
      
      setSelectedMatch('');
      setAmount('');
      setPrediction('');
      setError('');
      addNotification(`Pari placé avec succès ! Gain potentiel: ${savedBet.potentialGain}€`, 'success');
    } catch (error) {
      setError('Erreur de connexion')
      addNotification('Erreur de connexion au serveur', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="betting-container">
      <h1>Placer un Pari</h1>

      {isAuthenticated && (
        <div className="balance-display">
          <strong>Solde actuel: {user?.balance || 0} €</strong>
        </div>
      )}

      {!isAuthenticated && (
        <div className="auth-message">
          <p>Vous devez être connecté pour accéder à la page de paris.</p>
          <button onClick={() => navigate('/login')} className="login-button">
            Se connecter
          </button>
          <button onClick={() => navigate('/register')} className="register-button">
            S'inscrire
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {isAuthenticated && (
        <div className="bet-form">
          <div className="form-group">
            <label htmlFor="match">Choisir un match:</label>
            <select
              id="match"
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
            >
              <option value="">Sélectionner un match</option>
              {matches.map(match => (
                <option key={match.id} value={match.id}>
                  {match.team1} vs {match.team2} - {new Date(match.date).toLocaleDateString('fr-FR')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Montant (€):</label>
            <input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="Montant"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prediction">Prédiction:</label>
            <select
              id="prediction"
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
            >
              <option value="">Choisir une équipe</option>
              {selectedMatch && (() => {
                const match = matches.find(m => m.id == selectedMatch)
                return (
                  <>
                    <option value="team1">{match.team1} (Cote: {match.odds?.team1 || 2.0})</option>
                    <option value="team2">{match.team2} (Cote: {match.odds?.team2 || 2.0})</option>
                  </>
                )
              })()}
            </select>
          </div>

          <button
            onClick={placeBet}
            disabled={loading}
            className="place-bet-button"
          >
            {loading ? 'Placement...' : 'Placer le Pari'}
          </button>
        </div>
      )}

      {isAuthenticated && (
        <>
          <h2>Mes Paris</h2>
          {bets.length === 0 ? (
            <p>Aucun pari placé pour le moment.</p>
          ) : (
            <div className="bets-list">
              {bets.map(bet => (
                <div key={bet.id} className="bet-item">
                  <div className="bet-info">
                    <p><strong>Match:</strong> {bet.matchName}</p>
                    <p><strong>Mise:</strong> {bet.amount} €</p>
                    <p><strong>Cote:</strong> {bet.odds}</p>
                    <p><strong>Gain potentiel:</strong> {bet.potentialGain} €</p>
                    <p><strong>Statut:</strong>
                      <span className={`status ${bet.status}`}>
                        {bet.status === 'pending' ? 'En attente' :
                         bet.status === 'won' ? 'Gagné' : 'Perdu'}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default VisitorBetting