import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../utils/api';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [depositInputs, setDepositInputs] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';
    return date.toLocaleDateString('fr-FR');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await apiRequest('/users');
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await apiRequest(`/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      // Update the local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert('Rôle mis à jour avec succès');
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const updateUserBalance = async (userId, amount) => {
    try {
      const currentUser = users.find(u => u.id === userId);
      const newBalance = (currentUser.balance || 0) + amount;
      await apiRequest(`/users/${userId}/balance`, {
        method: 'PUT',
        body: JSON.stringify({ balance: newBalance }),
      });
      // Update the local state
      setUsers(users.map(u => u.id === userId ? { ...u, balance: newBalance } : u));
      setDepositInputs({ ...depositInputs, [userId]: '' });
      alert('Solde mis à jour avec succès');
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Erreur: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des Utilisateurs</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Solde (€)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'inscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {u.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {u.role === 'admin' ? 'Admin' : 'Utilisateur'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {u.balance || 0} €
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(u.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {u.id !== user.id ? (
                      <>
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="user">Utilisateur</option>
                          <option value="admin">Admin</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Montant"
                          value={depositInputs[u.id] || ''}
                          onChange={(e) => setDepositInputs({ ...depositInputs, [u.id]: e.target.value })}
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                        />
                        <button
                          onClick={() => {
                            const amount = parseFloat(depositInputs[u.id]);
                            if (amount > 0) {
                              updateUserBalance(u.id, amount);
                            }
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          Déposer
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400">Vous-même</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;