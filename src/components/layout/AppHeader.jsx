import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function AppHeader({ navOpen, onNavToggle, onProfileClick }) {
  const { user } = useAuth()

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="icon-btn desktop-hidden"
          onClick={onNavToggle}
          aria-label="Toggle navigation"
        >
          {navOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="brand">
          <span className="brand-mark">◆</span>
          <span className="brand-title">Projectfolio</span>
        </div>
      </div>

      <div className="header-right">
        {user ? (
          <button className="user-pill" onClick={onProfileClick}>
            <FaUserCircle className="user-pill-icon" />
            <span className="user-pill-meta">
              <span className="user-pill-name">{user.name}</span>
              <span className="user-pill-role">
                {user.role === 'admin' ? 'Admin / Faculty' : 'Student'}
              </span>
            </span>
          </button>
        ) : (
          <button className="primary-btn" onClick={onProfileClick}>
            Sign in
          </button>
        )}
      </div>
    </header>
  )
}
