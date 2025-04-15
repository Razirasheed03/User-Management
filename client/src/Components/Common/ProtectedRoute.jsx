import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // when me Trying to access admin-only route but not admin
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
