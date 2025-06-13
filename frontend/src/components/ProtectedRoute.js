import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
// This component checks if the user is logged in. If they are, it renders the children components.