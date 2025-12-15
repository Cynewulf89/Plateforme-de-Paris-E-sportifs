import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Si l'authentification est requise mais que l'utilisateur n'est pas connecté
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si un rôle spécifique est requis
  if (requiredRole && (!user || user.role !== requiredRole)) {
    // Rediriger vers la page d'accueil si l'utilisateur n'a pas le bon rôle
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;