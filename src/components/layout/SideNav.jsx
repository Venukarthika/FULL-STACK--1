import { NavLink } from 'react-router-dom'
import {
  FaHome,
  FaFolder,
  FaColumns,
  FaStream,
  FaImages,
  FaShieldAlt,
} from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext.jsx'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', Icon: FaHome, end: true },
  { to: '/student/projects', label: 'My Projects', Icon: FaFolder },
  { to: '/student/kanban', label: 'Kanban', Icon: FaColumns },
  { to: '/student/timeline', label: 'Timeline', Icon: FaStream },
  { to: '/student/portfolio', label: 'Portfolio', Icon: FaImages },
]

export default function SideNav({ navOpen, onClose }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <nav className={`side-nav ${navOpen ? 'side-nav-open' : ''}`}>
      {!isAdmin && NAV_ITEMS.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            ['nav-link', isActive ? 'nav-link-active' : '']
              .filter(Boolean)
              .join(' ')
          }
          onClick={onClose}
        >
          <Icon className="nav-icon" />
          <span>{label}</span>
        </NavLink>
      ))}

      {user?.role === 'admin' && (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            ['nav-link', isActive ? 'nav-link-active' : '']
              .filter(Boolean)
              .join(' ')
          }
          onClick={onClose}
        >
          <FaShieldAlt className="nav-icon" />
          <span>Admin Console</span>
        </NavLink>
      )}
    </nav>
  )
}
