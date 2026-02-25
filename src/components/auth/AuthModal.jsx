import { useState } from 'react'
import { FaUserGraduate, FaChalkboardTeacher, FaTimes } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext.jsx'

const ROLES = [
  {
    value: 'student',
    label: 'Student',
    Icon: FaUserGraduate,
    description: 'Track projects, upload work & build your portfolio',
  },
  {
    value: 'admin',
    label: 'Admin / Faculty',
    Icon: FaChalkboardTeacher,
    description: 'Review submissions, give feedback & monitor cohort progress',
  },
]

export default function AuthModal({ onClose }) {
  const { user, signup, login, updateProfile, logout } = useAuth()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState(user?.role || 'student')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const isProfileMode = Boolean(user)

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (isProfileMode) {
      if (!name.trim()) {
        setError('Please enter your full name.')
        return
      }

      const result = updateProfile({ name: name.trim(), role })
      if (!result.ok) {
        setError(result.error || 'Unable to update profile.')
        return
      }

      onClose()
      return
    }

    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.')
        return
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    if (mode === 'login' && !password) {
      setError('Please enter your password.')
      return
    }

    setBusy(true)
    const result = mode === 'signup'
      ? await signup({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        })
      : await login({
          email: email.trim(),
          password,
        })
    setBusy(false)

    if (!result.ok) {
      setError(result.error || 'Authentication failed. Please try again.')
      return
    }

    onClose()
  }

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* ── Left hero panel ── */}
        <div className="auth-hero">
          <button
            className="auth-close desktop-hidden"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
          <div className="auth-hero-logo">
            <span className="auth-hero-mark">◆</span>
          </div>
          <h2 className="auth-hero-title">Projectfolio</h2>
          <p className="auth-hero-sub">
            One verified workspace for academic project tracking, mentorship,
            and portfolio building.
          </p>
          <ul className="auth-feature-list">
            <li>✦ Track milestones & progress</li>
            <li>✦ Receive faculty feedback</li>
            <li>✦ Showcase your portfolio</li>
          </ul>
        </div>

        {/* ── Right form panel ── */}
        <div className="auth-form-panel">
          <button
            className="auth-close auth-close-right"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>

          <div className="auth-form-header">
            <h3 className="auth-form-title">
              {isProfileMode ? 'Your profile' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </h3>
            <p className="auth-form-sub">
              {isProfileMode
                ? 'Update your name or switch roles.'
                : mode === 'signup'
                  ? 'Create your account to access project tracking.'
                  : 'Sign in to continue to your project workspace.'}
            </p>
          </div>

          {!isProfileMode && (
            <div className="auth-mode-toggle" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                className={`auth-mode-btn ${mode === 'login' ? 'auth-mode-btn-active' : ''}`}
                onClick={() => {
                  setMode('login')
                  setError('')
                }}
              >
                Sign in
              </button>
              <button
                type="button"
                className={`auth-mode-btn ${mode === 'signup' ? 'auth-mode-btn-active' : ''}`}
                onClick={() => {
                  setMode('signup')
                  setError('')
                }}
              >
                Sign up
              </button>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {(isProfileMode || mode === 'signup') && (
              <div className="auth-field">
                <label className="auth-field-label" htmlFor="auth-name">
                  Full name
                </label>
                <input
                  id="auth-name"
                  className="auth-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  required
                  autoFocus
                />
              </div>
            )}

            {!isProfileMode && (
              <div className="auth-field">
                <label className="auth-field-label" htmlFor="auth-email">
                  Campus email
                </label>
                <input
                  id="auth-email"
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@college.edu"
                  required
                  autoFocus={mode === 'login'}
                />
              </div>
            )}

            {isProfileMode && (
              <div className="auth-field">
                <label className="auth-field-label" htmlFor="auth-email-readonly">
                  Campus email
                </label>
                <input
                  id="auth-email-readonly"
                  className="auth-input"
                  type="email"
                  value={email}
                  readOnly
                  disabled
                />
              </div>
            )}

            {!isProfileMode && (
              <div className="auth-field">
                <label className="auth-field-label" htmlFor="auth-password">
                  Password
                </label>
                <input
                  id="auth-password"
                  className="auth-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Minimum 8 characters' : 'Enter your password'}
                  required
                />
              </div>
            )}

            {!isProfileMode && mode === 'signup' && (
              <div className="auth-field">
                <label className="auth-field-label" htmlFor="auth-confirm-password">
                  Confirm password
                </label>
                <input
                  id="auth-confirm-password"
                  className="auth-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                />
              </div>
            )}

            {(isProfileMode || mode === 'signup') && (
              <div className="auth-field">
                <span className="auth-field-label">I am a…</span>
                <div className="auth-role-grid">
                  {ROLES.map(({ value, label, Icon, description }) => (
                    <button
                      key={value}
                      type="button"
                      className={`auth-role-card ${role === value ? 'auth-role-card-active' : ''}`}
                      onClick={() => setRole(value)}
                    >
                      <Icon className="auth-role-icon" />
                      <span className="auth-role-label">{label}</span>
                      <span className="auth-role-desc">{description}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="auth-error-text">{error}</p>}

            <div className="auth-actions">
              {isProfileMode && (
                <button
                  type="button"
                  className="auth-signout-btn"
                  onClick={() => {
                    logout()
                    onClose()
                  }}
                >
                  Sign out
                </button>
              )}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={busy}
              >
                {busy
                  ? 'Please wait...'
                  : isProfileMode
                    ? 'Save changes'
                    : mode === 'signup'
                      ? `Create ${role === 'admin' ? 'Faculty' : 'Student'} account →`
                      : 'Sign in →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
