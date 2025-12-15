import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider, useNotification } from './contexts/NotificationContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import AdminTeams from './pages/AdminTeams'
import AdminMatches from './pages/AdminMatches'
import AdminUsers from './pages/AdminUsers'
import VisitorBetting from './pages/VisitorBetting'
import VisitorResults from './pages/VisitorResults'
import VisitorGains from './pages/VisitorGains'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import './App.css'

function AppContent() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout, updateMode } = useAuth();
  const { addNotification } = useNotification();

  const handleLogout = () => {
    logout();
    addNotification('Déconnexion réussie', 'success');
  };

  return (
    <Router>
      <nav>
        <Link to="/">Accueil</Link>
        {isAuthenticated && (
          <> | 
            <Link to="/betting">Parier</Link>
          </>
        )}
        {isAuthenticated && user?.role === 'admin' && (
          <> | 
            <Link to="/admin/teams">Admin Équipes</Link> | 
            <Link to="/admin/matches">Admin Matchs</Link> | 
            <Link to="/admin/users">Admin Utilisateurs</Link>
          </>
        )}
        {isAuthenticated && (
          <> | 
            <Link to="/results">Résultats</Link> | 
            <Link to="/gains">Gains</Link>
          </>
        )}
        {!isAuthenticated && (
          <> | 
            <Link to="/results">Résultats</Link>
          </>
        )}
        {isAuthenticated && user ? (
          <>
            | <Link to="/profile">Profil ({user.name || 'Utilisateur'})</Link>
            <button onClick={handleLogout} className="logout-nav-button">Déconnexion</button>
          </>
        ) : (
          <>
            | <Link to="/login">Connexion</Link> | <Link to="/register">Inscription</Link>
          </>
        )}
        <button onClick={toggleTheme} className="theme-toggle">
          {isDark ? '☀️' : '🌙'}
        </button>
        {isAuthenticated && user && (
          <> | Solde: {user.balance}€ </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin/teams" element={
          <ProtectedRoute requiredRole="admin">
            <AdminTeams />
          </ProtectedRoute>
        } />
        <Route path="/admin/matches" element={
          <ProtectedRoute requiredRole="admin">
            <AdminMatches />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/betting" element={<VisitorBetting />} />
        <Route path="/results" element={
          <VisitorResults />
        } />
        <Route path="/gains" element={
          <ProtectedRoute>
            <VisitorGains />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}

export default App