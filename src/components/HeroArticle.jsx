import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { CAT_COLORS, CATEGORIAS, readTime } from '../lib/shared'
import styles from './HeroArticle.module.css'

function ago(ts) {
  try { return formatDistanceToNow(new Date(ts), { addSuffix: false, locale: es }) }
  catch { return '' }
}
function fmtDate(ts) {
  try { return new Date(ts).toLocaleDateString('es-AR', { day:'numeric', month:'long', year:'numeric' }) }
  catch { return '' }
}
function catLabel(key) {
  return CATEGORIAS.find(c => c.key === key)?.label || key
}

export default function HeroArticle({ post, loading }) {
  if (loading) return <div className={styles.skeleton} />

  if (!post) return (
    <div className={styles.empty}>
      <span>📰</span>
      <p>Aún no hay artículos publicados. ¡Publicá el primero!</p>
    </div>
  )

  const cc = CAT_COLORS[post.categoria] || CAT_COLORS.ambiente

  return (
    <div className={styles.hero}>
      {/* Imagen */}
      <div className={styles.imgWrap}>
        {post.media_url
          ? <img src={post.media_url} alt={post.titulo} className={styles.img} />
          : <div className={styles.imgPh}><span>🌿</span></div>
        }
      </div>

      {/* Contenido */}
      <div className={styles.content}>
        <span className={styles.catBadge} style={{ background: cc.bg, color: cc.color }}>
          {catLabel(post.categoria)}
        </span>
        <Link to={`/articulo/${post.id}`}><h2 className={styles.title}>{post.titulo}</h2></Link>
        {post.bajada && <p className={styles.excerpt}>{post.bajada}</p>}
        <div className={styles.meta}>
          <span>📅 {fmtDate(post.created_at)}</span>
          <span>⏱ {readTime(post.cuerpo)} min de lectura</span>
        </div>
      </div>
    </div>
  )
}
