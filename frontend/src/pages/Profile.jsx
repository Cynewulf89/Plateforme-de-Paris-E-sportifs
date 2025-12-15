import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user's bets
    const loadUserBets = async () => {
      try {
        const allBets = await apiRequest('/bets');
        // Filter bets by current user (in a real app, this would be done server-side)
        const userBets = allBets.filter(bet => bet.userId === user?.id);
        setBets(userBets);
      } catch (error) {
        console.error('Erreur lors du chargement des paris:', error);
      } finally {
        setLoading(false);
      }
    };;

    loadUserBets();
  }, [isAuthenticated, navigate, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Mon Profil</h2>
        <button onClick={handleLogout} className="logout-button">
          Déconnexion
        </button>
      </div>

      <div className="profile-info">
        <h3>Informations personnelles</h3>
        <p><strong>Nom:</strong> {user?.name || 'Non spécifié'}</p>
        <p><strong>Email:</strong> {user?.email || 'Non spécifié'}</p>
        <p><strong>Membre depuis:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <div className="profile-stats">
        <h3>Statistiques</h3>
        <div className="stats-grid">
          <div className="stat">
            <h4>Total des paris</h4>
            <p>{bets.length}</p>
          </div>
          <div className="stat">
            <h4>Paris gagnés</h4>
            <p>{bets.filter(bet => bet.status === 'won').length}</p>
          </div>
          <div className="stat">
            <h4>Paris perdus</h4>
            <p>{bets.filter(bet => bet.status === 'lost').length}</p>
          </div>
          <div className="stat">
            <h4>Gains totaux</h4>
            <p>{bets.filter(bet => bet.status === 'won').reduce((sum, bet) => sum + bet.potentialGain, 0).toFixed(2)} €</p>
          </div>
        </div>
      </div>

      <div className="profile-bets">
        <h3>Historique des paris</h3>
        {loading ? (
          <p>Chargement...</p>
        ) : bets.length === 0 ? (
          <p>Aucun pari trouvé.</p>
        ) : (
          <div className="bets-list">
            {bets.map(bet => (
              <div key={bet.id} className={`bet-item ${bet.status}`}>
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
      </div>
    </div>
  );
};

export default Profile;