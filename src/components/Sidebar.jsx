import { useState, useEffect } from 'react'
import { fetchTips } from '../lib/supabase'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const [tips, setTips] = useState([])

  useEffect(() => {
    fetchTips().then(setTips).catch(() => {})
  }, [])

  return (
    <aside className={styles.aside}>

      {/* Eco Tips */}
      <div className={styles.widget}>
        <div className={styles.widgetHead}>
          <span className={styles.leaf}>🌿</span> Eco Tips
        </div>
        {tips.map(t => (
          <div key={t.id} className={styles.tipCard}>
            <div className={styles.tipIcon}>{t.icono}</div>
            <div>
              <strong>{t.titulo}</strong>
              {t.descripcion && <p>{t.descripcion}</p>}
            </div>
          </div>
        ))}
        {tips.length === 0 && (
          <div className={styles.tipCard}>
            <div className={styles.tipIcon}>🌿</div>
            <div><strong>Cargando tips...</strong></div>
          </div>
        )}
      </div>

      {/* Seguinos */}
      <div className={styles.widget}>
        <div className={styles.widgetHead}>Seguinos</div>
        <a href="#" className={`${styles.social} ${styles.ig}`}>
          <span className={styles.socialIcon}>📸</span>
          <div>
            <strong>Instagram</strong>
            <span>@ecojuy.ambiental</span>
          </div>
        </a>
        <a href="#" className={`${styles.social} ${styles.fb}`}>
          <span className={styles.socialIcon}>👍</span>
          <div>
            <strong>Facebook</strong>
            <span>EcoJuy – Información y Conciencia Ambiental</span>
          </div>
        </a>
        <a href="#" className={`${styles.social} ${styles.wa}`}>
          <span className={styles.socialIcon}>💬</span>
          <div>
            <strong>Canal de WhatsApp</strong>
            <span>Sumate y recibí nuestras novedades</span>
          </div>
        </a>
      </div>

    </aside>
  )
}
