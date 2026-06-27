import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        © {new Date().getFullYear()} EcoJuy – Información y Conciencia Ambiental. Todos los derechos reservados.
      </div>
    </footer>
  )
}
