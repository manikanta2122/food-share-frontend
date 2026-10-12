import React, { useState } from 'react';
import { HeartHandshake, LogIn, UserPlus, LogOut, LayoutDashboard, UserCircle, Menu, X } from 'lucide-react';

export default function Header({
  currentUser,
  onNavigate,
  onLogout,
  currentView,
  backendConnected
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => onNavigate('home')}>
        <div className="brand-icon-wrapper">
          <HeartHandshake size={26} strokeWidth={2.3} />
        </div>
        <div>
          <h1 className="brand-title">FoodShare</h1>
          <span className="brand-subtitle">Community Food Rescue & Redistribution</span>
        </div>
      </div>

      <div className="nav-actions">
        {/* Navigation links */}
        <button
          className={`nav-link-btn ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Browse Food
        </button>

        {currentUser && (
          <button
            className={`nav-link-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onNavigate('dashboard')}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>
        )}

        {/* Auth section */}
        {currentUser ? (
          <div className="user-profile-menu">
            <div className="user-avatar-tag">
              <div className="user-avatar">
                {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-name-wrapper">
                <span className="user-display-name">{currentUser.fullName}</span>
                <span className={`role-badge role-${currentUser.role.toLowerCase()}`}>
                  {currentUser.role === 'DONOR' ? 'FOOD PROVIDER' : currentUser.role}
                </span>
              </div>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              id="btn-logout"
              onClick={onLogout}
              title="Sign Out"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="auth-buttons-group">
            <button
              className="btn btn-secondary btn-sm"
              id="btn-nav-login"
              onClick={() => onNavigate('login')}
            >
              <LogIn size={16} />
              <span>Log In</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              id="btn-nav-register"
              onClick={() => onNavigate('register')}
            >
              <UserPlus size={16} />
              <span>Register</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
