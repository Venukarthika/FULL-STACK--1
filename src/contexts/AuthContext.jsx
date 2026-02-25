import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'pm_users_v1'
const SESSION_KEY = 'pm_session_v1'

function safeParse(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function getUsers() {
  return safeParse(localStorage.getItem(USERS_KEY) || '[]', [])
}

function setUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getSession() {
  return safeParse(localStorage.getItem(SESSION_KEY) || 'null', null)
}

function setSession(session) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function randomSalt() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder()
  const data = encoder.encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSession)

  const signup = async ({ name, email, password, role }) => {
    const cleanName = name.trim()
    const cleanEmail = normalizeEmail(email)
    const users = getUsers()

    if (users.some((u) => normalizeEmail(u.email) === cleanEmail)) {
      return { ok: false, error: 'An account with this email already exists.' }
    }

    const salt = randomSalt()
    const passwordHash = await hashPassword(password, salt)
    const account = {
      id: crypto.randomUUID(),
      name: cleanName,
      email: cleanEmail,
      role,
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
    }

    setUsers([account, ...users])

    const session = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    }
    setUser(session)
    setSession(session)
    return { ok: true }
  }

  const login = async ({ email, password }) => {
    const cleanEmail = normalizeEmail(email)
    const users = getUsers()
    const account = users.find((u) => normalizeEmail(u.email) === cleanEmail)

    if (!account) {
      return { ok: false, error: 'No account found for this email.' }
    }

    const incomingHash = await hashPassword(password, account.salt)
    if (incomingHash !== account.passwordHash) {
      return { ok: false, error: 'Incorrect password.' }
    }

    const session = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    }
    setUser(session)
    setSession(session)
    return { ok: true }
  }

  const updateProfile = ({ name, role }) => {
    if (!user?.id) return { ok: false, error: 'Not signed in.' }

    const cleanName = name.trim()
    const users = getUsers()
    const updatedUsers = users.map((account) =>
      account.id === user.id
        ? {
            ...account,
            name: cleanName,
            role,
          }
        : account,
    )

    setUsers(updatedUsers)

    const nextSession = {
      ...user,
      name: cleanName,
      role,
    }
    setUser(nextSession)
    setSession(nextSession)
    return { ok: true }
  }

  const logout = () => {
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

