import { useState, useEffect } from 'react'
import { externalAPI } from '../services/externalAPI'
import { apiRequest } from '../utils/api'
import io from 'socket.io-client'

function VisitorResults() {
  const [finishedMatches, setFinishedMatches] = useState([])
  const [upcomingMatches, setUpcomingMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('results')

  const loadResults = async () => {
    try {
      // Load all matches
      const allMatches = await apiRequest('/matches');
      const finished = allMatches.filter(match => match.status === 'finished');
      const upcoming = allMatches.filter(match => match.status !== 'finished');
      setFinishedMatches(finished);
      setUpcomingMatches(upcoming);
    } catch (error) {
      console.error('Erreur lors du chargement des résultats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResults()
  }, [])

  useEffect(() => {
    const socket = io('http://localhost:5000')

    socket.on('matchUpdated', () => {
      loadResults()
    })

    return () => {
      socket.off('matchUpdated')
      socket.disconnect()
    }
  }, [])

  if (loading) {
    return (
      <div className="results-container">
        <h1>Résultats des Matchs</h1>
        <p>Chargement des résultats...</p>
      </div>
    )
  }

  return (
    <div className="results-container">
      <h1>Résultats des Matchs</h1>

      <div className="results-tabs">
        <button
          className={activeTab === 'results' ? 'active' : ''}
          onClick={() => setActiveTab('results')}
        >
          Tous les Résultats
        </button>
        <button
          className={activeTab === 'official' ? 'active' : ''}
          onClick={() => setActiveTab('official')}
        >
          Matchs Officiels
        </button>
        <button
          className={activeTab === 'created' ? 'active' : ''}
          onClick={() => setActiveTab('created')}
        >
          Matchs Créés
        </button>
        <button
          className={activeTab === 'upcoming' ? 'active' : ''}
          onClick={() => setActiveTab('upcoming')}
        >
          Matchs à venir
        </button>
      </div>

      {activeTab === 'results' && (
        <div className="results-section">
          <h2>Tous les Résultats</h2>
          {finishedMatches.length === 0 ? (
            <p>Aucun match terminé pour le moment.</p>
          ) : (
            <div className="results-list">
              {finishedMatches.map(match => (
                <div key={match.id} className="result-item">
                  <div className="match-info">
                    <h3>{match.team1} vs {match.team2}</h3>
                    <p><strong>Date:</strong> {new Date(match.date).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Score:</strong> {match.score || 'N/A'}</p>
                    <p><strong>Vainqueur:</strong> {match.result ? (match.result === 'team1' ? match.team1 : match.team2) : 'À déterminer'}</p>
                    <p><strong>Type:</strong> {match.id.startsWith('demo') ? 'Match créé' : 'Match officiel'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'official' && (
        <div className="results-section">
          <h2>Résultats - Matchs Officiels</h2>
          {finishedMatches.filter(match => !match.id.startsWith('demo')).length === 0 ? (
            <p>Aucun match officiel terminé pour le moment.</p>
          ) : (
            <div className="results-list">
              {finishedMatches.filter(match => !match.id.startsWith('demo')).map(match => (
                <div key={match.id} className="result-item">
                  <div className="match-info">
                    <h3>{match.team1} vs {match.team2}</h3>
                    <p><strong>Date:</strong> {new Date(match.date).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Score:</strong> {match.score || 'N/A'}</p>
                    <p><strong>Vainqueur:</strong> {match.result ? (match.result === 'team1' ? match.team1 : match.team2) : 'À déterminer'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'created' && (
        <div className="results-section">
          <h2>Résultats - Matchs Créés</h2>
          {finishedMatches.filter(match => match.id.startsWith('demo')).length === 0 ? (
            <p>Aucun match créé terminé pour le moment.</p>
          ) : (
            <div className="results-list">
              {finishedMatches.filter(match => match.id.startsWith('demo')).map(match => (
                <div key={match.id} className="result-item">
                  <div className="match-info">
                    <h3>{match.team1} vs {match.team2}</h3>
                    <p><strong>Date:</strong> {new Date(match.date).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Score:</strong> {match.score || 'N/A'}</p>
                    <p><strong>Vainqueur:</strong> {match.result ? (match.result === 'team1' ? match.team1 : match.team2) : 'À déterminer'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'upcoming' && (
        <div className="results-section">
          <h2>Matchs à venir / en cours</h2>
          {upcomingMatches.length === 0 ? (
            <p>Aucun match à venir.</p>
          ) : (
            <div className="results-list">
              {upcomingMatches.map(match => (
                <div key={match.id} className="result-item">
                  <div className="match-info">
                    <h3>{match.team1} vs {match.team2}</h3>
                    <p><strong>Date:</strong> {new Date(match.date).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Statut:</strong> {match.status === 'upcoming' ? 'À venir' : 'En cours'}</p>
                    <p><strong>Cotes:</strong> {match.team1}: {match.odds?.team1 || 2.0}, {match.team2}: {match.odds?.team2 || 2.0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VisitorResults