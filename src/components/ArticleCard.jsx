import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { CAT_COLORS, CATEGORIAS, readTime } from '../lib/shared'
import styles from './ArticleCard.module.css'

function fmtDate(ts) {
  try { return new Date(ts).toLocaleDateString('es-AR', { day:'numeric', month:'long', year:'numeric' }) }
  catch { return '' }
}
function catLabel(key) { return CATEGORIAS.find(c => c.key === key)?.label || key }

export default function ArticleCard({ post, isAdmin, onDelete, size = 'normal' }) {
  const cc = CAT_COLORS[post.categoria] || CAT_COLORS.ambiente

  return (
    <article className={`${styles.card} ${size === 'small' ? styles.small : ''}`}>
      {post.media_url && (
        <div className={styles.imgWrap}>
          <img src={post.media_url} alt={post.titulo} className={styles.img} />
        </div>
      )}
      <div className={styles.body}>
        <span className={styles.cat} style={{ background: cc.bg, color: cc.color }}>
          {catLabel(post.categoria)}
        </span>
        <Link to={`/articulo/${post.id}`}><h3 className={styles.title}>{post.titulo}</h3></Link>
        {size !== 'small' && post.bajada && (
          <p className={styles.excerpt}>{post.bajada}</p>
        )}
        <div className={styles.meta}>
          {post.autor && <span className={styles.autor}>Por {post.autor}</span>}
          <span>📅 {fmtDate(post.created_at)}</span>
          <span>⏱ {readTime(post.cuerpo)} min de lectura</span>
        </div>
        {isAdmin && (
          <div className={styles.adminBtns}>
            <button className={styles.editBtn} onClick={() => onEdit(post)}>✎ Editar</button>
            <button className={styles.deleteBtn} onClick={() => onDelete(post.id)}>× Eliminar</button>
          </div>
        )}
      </div>
    </article>
  )
}
