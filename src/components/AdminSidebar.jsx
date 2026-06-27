import styles from './AdminSidebar.module.css'

export default function AdminSidebar({ userEmail, onSignOut, onTips }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src="https://jinewleiekzfyatuxegn.supabase.co/storage/v1/object/public/media/logo.jpeg" alt="EcoJuy" className={styles.logoImg} />
        <div className={styles.brandSub}>PANEL DE ADMINISTRACIÓN</div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navLabel}>MENÚ</div>
        <div className={`${styles.navItem} ${styles.navActive}`}>
          <span>📰</span> Noticias
        </div>
        <button className={styles.navItem} onClick={onTips}>
          <span>🌿</span> Eco Tips
        </button>
        <a href="/" target="_blank" rel="noopener noreferrer" className={styles.navItem}>
          <span>👁</span> Ver sitio
        </a>
      </nav>

      <div className={styles.footer}>
        <div className={styles.userEmail}>{userEmail}</div>
        <button className={styles.signOut} onClick={onSignOut}>→ Cerrar sesión</button>
      </div>
    </aside>
  )
}
