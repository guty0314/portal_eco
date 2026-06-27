import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getSession, onAuthChange } from './lib/supabase'
import PublicPage   from './pages/PublicPage'
import AdminPage    from './pages/AdminPage'
import LoginPage    from './pages/LoginPage'
import ArticlePage  from './pages/ArticlePage'

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    getSession().then(s => setSession(s))
    return onAuthChange(s => setSession(s))
  }, [])

  if (session === undefined) return null

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<PublicPage />} />
        <Route path="/categoria/:cat" element={<PublicPage />} />
        <Route path="/articulo/:id" element={<ArticlePage />} />
        <Route path="/admin/login"  element={session ? <Navigate to="/admin" replace /> : <LoginPage />} />
        <Route path="/admin"        element={session ? <AdminPage session={session} /> : <Navigate to="/admin/login" replace />} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
