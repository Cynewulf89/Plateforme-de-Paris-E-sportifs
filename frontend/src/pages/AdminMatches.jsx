import { useState, useEffect } from 'react'
import { apiRequest } from '../utils/api'

function AdminMatches() {
  const [matches, setMatches] = useState([])
  const [teams, setTeams] = useState([])
  const [team1, setTeam1] = useState('')
  const [team2, setTeam2] = useState('')
  const [date, setDate] = useState('')
  const [tournament, setTournament] = useState('Ligue principale')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [matchesData, teamsData] = await Promise.all([
        apiRequest('/matches'),
        apiRequest('/teams')
      ]);
      setMatches(matchesData);
      setTeams(teamsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMatch = async () => {
    if (team1 && team2 && date) {
      try {
        const newMatch = await apiRequest('/matches', {
          method: 'POST',
          body: JSON.stringify({ team1, team2, date, tournament }),
        });
        setMatches([...matches, newMatch]);
        setTeam1('');
        setTeam2('');
        setDate('');
        setTournament('Ligue principale');
      } catch (error) {
        console.error('Erreur lors de l\'ajout du match:', error);
      }
    }
  };

  const updateMatchStatus = async (id, newStatus) => {
    try {
      await apiRequest(`/matches/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      setMatches(matches.map(match => match.id === id ? { ...match, status: newStatus } : match));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du match:', error);
    }
  };

  const deleteMatch = async (id) => {
    try {
      await apiRequest(`/matches/${id}`, {
        method: 'DELETE',
      });
      setMatches(matches.filter(match => match.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du match:', error);
    }
  };

  return (
    <div>
      <h1>Gestion des Matchs</h1>
      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <>
          <div>
            <select value={team1} onChange={(e) => setTeam1(e.target.value)}>
              <option value="">Sélectionner Équipe 1</option>
              {teams.map(team => (
                <option key={team.id} value={team.name}>{team.name}</option>
              ))}
            </select>
            <select value={team2} onChange={(e) => setTeam2(e.target.value)}>
              <option value="">Sélectionner Équipe 2</option>
              {teams.map(team => (
                <option key={team.id} value={team.name}>{team.name}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tournoi"
              value={tournament}
              onChange={(e) => setTournament(e.target.value)}
            />
            <button onClick={addMatch}>Ajouter Match</button>
          </div>
          <ul>
            {matches.map(match => (
              <li key={match.id}>
                <strong>{match.team1} vs {match.team2}</strong> - {new Date(match.date).toLocaleString('fr-FR')} - {match.tournament}
                <span style={{
                  marginLeft: '10px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: match.status === 'finished' ? '#d4edda' : match.status === 'ongoing' ? '#fff3cd' : '#cce7ff',
                  color: match.status === 'finished' ? '#155724' : match.status === 'ongoing' ? '#856404' : '#004085'
                }}>
                  {match.status === 'upcoming' ? 'À venir' : match.status === 'ongoing' ? 'En cours' : 'Terminé'}
                </span>
                {match.status === 'upcoming' && <button onClick={() => updateMatchStatus(match.id, 'ongoing')} style={{marginLeft: '10px'}}>Démarrer</button>}
                {match.status === 'ongoing' && <button onClick={() => updateMatchStatus(match.id, 'finished')} style={{marginLeft: '10px'}}>Terminer</button>}
                <button onClick={() => deleteMatch(match.id)} style={{marginLeft: '10px'}}>Supprimer</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default AdminMatches