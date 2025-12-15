import { useState, useEffect } from 'react'
import { apiRequest } from '../utils/api'

function AdminTeams() {
  const [teams, setTeams] = useState([])
  const [name, setName] = useState('')
  const [logo, setLogo] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    try {
      const teamsData = await apiRequest('/teams');
      setTeams(teamsData);
    } catch (error) {
      console.error('Erreur lors du chargement des équipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Le nom de l\'équipe est requis.'
    if (!logo.trim()) newErrors.logo = 'Veuillez choisir un logo.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addTeam = async () => {
    if (validate()) {
      try {
        const newTeam = await apiRequest('/teams', {
          method: 'POST',
          body: JSON.stringify({ name, logo, description }),
        });
        setTeams([...teams, newTeam]);
        setName('');
        setLogo('');
        setDescription('');
        setErrors({});
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'équipe:', error);
        setErrors({ submit: error.message || 'Erreur lors de l\'ajout de l\'équipe' });
      }
    }
  };

  const deleteTeam = async (id) => {
    try {
      await apiRequest(`/teams/${id}`, {
        method: 'DELETE',
      });
      setTeams(teams.filter(team => team.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'équipe:', error);
    }
  };

  return (
    <div>
      <h1>Gestion des Équipes</h1>
      {loading ? (
        <p>Chargement des équipes...</p>
      ) : (
        <>
          <div>
            <input
              type="text"
              placeholder="Nom de l'équipe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p style={{color: 'red'}}>{errors.name}</p>}
            <select
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
            >
              <option value="">Choisir un logo</option>
              <option value="https://dummyimage.com/50x50/FF6B6B/FFFFFF&text=Paris">Paris Phoenix</option>
              <option value="https://dummyimage.com/50x50/4ECDC4/FFFFFF&text=Lyon">Lyon Lions</option>
              <option value="https://dummyimage.com/50x50/45B7D1/FFFFFF&text=Marseille">Marseille Sharks</option>
              <option value="https://dummyimage.com/50x50/F7DC6F/FFFFFF&text=Toulouse">Toulouse Tigers</option>
              <option value="https://dummyimage.com/50x50/BB8FCE/FFFFFF&text=Fnatic">Fnatic</option>
              <option value="https://dummyimage.com/50x50/85C1E9/FFFFFF&text=G2">G2 Esports</option>
              <option value="https://dummyimage.com/50x50/F8C471/FFFFFF&text=Liquid">Team Liquid</option>
              <option value="https://dummyimage.com/50x50/AED6F1/FFFFFF&text=Cloud9">Cloud9</option>
            </select>
            {errors.logo && <p style={{color: 'red'}}>{errors.logo}</p>}
            {logo && (
              <div>
                <p>Aperçu du logo:</p>
                <img src={logo} alt="Aperçu du logo" width="100" style={{border: '1px solid #ccc', borderRadius: '4px'}} />
              </div>
            )}
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.submit && <p style={{color: 'red'}}>{errors.submit}</p>}
            <button onClick={addTeam}>Ajouter Équipe</button>
          </div>
          <ul>
            {teams.map(team => (
              <li key={team.id}>
                <strong>{team.name}</strong>
                {team.logo && <img src={team.logo} alt={team.name} width="50" style={{marginLeft: '10px'}} />}
                {team.description && <span style={{marginLeft: '10px'}}>{team.description}</span>}
                <button onClick={() => deleteTeam(team.id)} style={{marginLeft: '10px'}}>Supprimer</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default AdminTeams