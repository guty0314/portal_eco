import { Link, useParams, useNavigate } from 'react-router-dom'
import { CATEGORIAS } from '../lib/shared'
import styles from './Header.module.css'

export default function Header({ isAdmin, onPublish, onSignOut, userEmail }) {
  const { cat } = useParams()
  const navigate  = useNavigate()
  const activeCat = cat || 'inicio'

  return (
    <header>
      {/* Top bar */}
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <span className={styles.fecha}>{new Date().toLocaleDateString('es-AR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</span>
          <div className={styles.topRight}>
            {isAdmin && (
              <>
                <span className={styles.adminBadge}>● Admin: {userEmail}</span>
                <button className={styles.topBtn} onClick={onSignOut}>Cerrar sesión</button>
              </>
            )}
            {!isAdmin && (
              <Link to="/admin/login" className={styles.topBtn}>Acceso admin</Link>
            )}
          </div>
        </div>
      </div>

      {/* Logo bar */}
      <div className={styles.logoBar}>
        <div className={styles.logoBarInner}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <img src="https://jinewleiekzfyatuxegn.supabase.co/storage/v1/object/public/media/logo.jpeg" alt="EcoJuy" className={styles.logoImg} />
            </div>
          </Link>
          <div className={styles.logoBanner}>
            <p>Periodismo ambiental</p>
            <p>para una ciudadanía</p>
            <p><strong>informada y activa.</strong></p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          {CATEGORIAS.map(c => (
            <Link
              key={c.key}
              to={c.key === 'inicio' ? '/' : `/categoria/${c.key}`}
              className={`${styles.navLink} ${activeCat === c.key ? styles.navActive : ''}`}
            >
              {c.label}
            </Link>
          ))}
          {isAdmin && (
            <>
              <button className={styles.tipsBtn} onClick={onTips}>🌿 Eco Tips</button>
              <button className={styles.publishBtn} onClick={onPublish}>+ Publicar</button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
