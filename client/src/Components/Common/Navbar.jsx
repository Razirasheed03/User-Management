import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { User } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="navbar">
      <div className="navbar-left">
      <Link to={user ? (user.isAdmin ? "/admin-dashboard" : "/") : "/"} className="logo">
  Redux-Manager
</Link>

      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/profile" className="nav-link profile-link">
              <User size={18} className="icon" />
              Profile
            </Link>
            <button className="nav-button" onClick={() => dispatch(logout())}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
