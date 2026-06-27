import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signIn } from '../lib/supabase'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null); setLoading(true)
    try { await signIn(email, password) }
    catch { setError('Email o contraseña incorrectos.') }
    finally { setLoading(false) }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src="https://jinewleiekzfyatuxegn.supabase.co/storage/v1/object/public/media/logo.jpeg" alt="EcoJuy" className={styles.logo} />
          <div className={styles.adminLabel}>Acceso Administrador</div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@ecojuy.com" required autoFocus />
          </div>
          <div className={styles.field}>
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar →'}
          </button>
        </form>

        <div className={styles.footer}>
          <Link to="/" className={styles.back}>← Volver al portal</Link>
        </div>
      </div>
    </div>
  )
}
