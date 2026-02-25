import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from './contexts/AuthContext.jsx'
import AppHeader from './components/layout/AppHeader.jsx'
import SideNav from './components/layout/SideNav.jsx'
import FooterTicker from './components/layout/FooterTicker.jsx'
import AuthModal from './components/auth/AuthModal.jsx'
import OverviewPage from './pages/OverviewPage.jsx'
import StudentProjectsPage from './pages/StudentProjectsPage.jsx'
import StudentKanbanPage from './pages/StudentKanbanPage.jsx'
import TimelinePage from './pages/TimelinePage.jsx'
import PortfolioPage from './pages/PortfolioPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}

function Shell() {
  const { user } = useAuth()
  const [navOpen, setNavOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(!user)
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    setShowAuthModal(!user)
  }, [user])

  return (
    <div className="app-root">
      <AppHeader
        navOpen={navOpen}
        onNavToggle={() => setNavOpen((v) => !v)}
        onProfileClick={() => setShowAuthModal(true)}
      />

      <div className="app-body">
        <SideNav navOpen={navOpen} onClose={() => setNavOpen(false)} />

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={isAdmin ? <Navigate to="/admin" replace /> : <OverviewPage />}
            />
            <Route
              path="/student/projects"
              element={isAdmin ? <Navigate to="/admin" replace /> : <StudentProjectsPage />}
            />
            <Route
              path="/student/kanban"
              element={isAdmin ? <Navigate to="/admin" replace /> : <StudentKanbanPage />}
            />
            <Route
              path="/student/timeline"
              element={isAdmin ? <Navigate to="/admin" replace /> : <TimelinePage />}
            />
            <Route
              path="/student/portfolio"
              element={isAdmin ? <Navigate to="/admin" replace /> : <PortfolioPage />}
            />
            <Route
              path="/admin"
              element={isAdmin ? <AdminPage /> : <Navigate to="/" replace />}
            />
          </Routes>
        </main>
      </div>

      <FooterTicker />

      {showAuthModal && (
        <AuthModal onClose={() => user && setShowAuthModal(false)} />
      )}
    </div>
  )
}

export default App
