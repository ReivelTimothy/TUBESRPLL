// components/Navbar.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/home" className="navbar-logo">
          <span>Company</span>
          <span className="highlight">HR</span>
        </NavLink>
        
        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
          <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Home
            </NavLink>
          </li>
          {isAuthenticated ? (
            <>
              {/* removed auction/transaction links */}
              <li className="nav-item">
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  My Profile
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/leave" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Leave
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/attendance" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Attendance
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/directory" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Directory
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/payroll" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Payroll
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/reimburse" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Reimburse
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/penalty" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Penalty
                </NavLink>
              </li>
              <li className="nav-item">
                <button className="nav-button logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
              {user && (
                <li className="nav-item user-info">
                  <span className="username">{user.name || user.email}</span>
                </li>
              )}
              {user?.role === 'ADMIN' && (
                <li className="nav-item">
                  <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Admin
                  </NavLink>
                </li>
              )}
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Login
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;