import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchPostById } from '../lib/supabase'
import { CAT_COLORS, CATEGORIAS, readTime, getVideoEmbed } from '../lib/shared'
import Header  from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer  from '../components/Footer'
import styles  from './ArticlePage.module.css'

function renderBody(cuerpo, imagenes) {
  const parrafos = cuerpo.split('\n').filter(p => p.trim())
  if (!imagenes.length) {
    return parrafos.map((p, i) => <p key={i}>{p}</p>)
  }

  const interval = Math.max(2, Math.floor(parrafos.length / (imagenes.length + 1)))
  const result = []
  let imgIdx = 0

  parrafos.forEach((p, i) => {
    result.push(<p key={`p-${i}`}>{p}</p>)
    if (imgIdx < imagenes.length && (i + 1) % interval === 0) {
      result.push(
        <img key={`img-${imgIdx}`} src={imagenes[imgIdx]} alt="" className={styles.inlineImg} />
      )
      imgIdx++
    }
  })
  while (imgIdx < imagenes.length) {
    result.push(
      <img key={`img-${imgIdx}`} src={imagenes[imgIdx]} alt="" className={styles.inlineImg} />
    )
    imgIdx++
  }

  return result
}

function fmtDate(ts) {
  try { return new Date(ts).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) }
  catch { return '' }
}
function catLabel(key) { return CATEGORIAS.find(c => c.key === key)?.label || key }

export default function ArticlePage() {
  const { id } = useParams()
  const [post,    setPost]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchPostById(id)
      .then(setPost)
      .catch(() => setError('No se encontró el artículo.'))
      .finally(() => setLoading(false))
  }, [id])

  const cc    = post ? (CAT_COLORS[post.categoria] || CAT_COLORS.ambiente) : null
  const video = post ? getVideoEmbed(post.video_url) : null

  return (
    <>
      <Header isAdmin={false} />

      <div className={styles.wrapper}>
        <div className={styles.layout}>
          <main className={styles.main}>
            {loading && <div className={styles.skeleton} />}

            {error && (
              <div className={styles.error}>
                <p>{error}</p>
                <Link to="/" className={styles.back}>← Volver al inicio</Link>
              </div>
            )}

            {post && (
              <article className={styles.article}>
                <Link to="/" className={styles.back}>← Volver al inicio</Link>

                {post.media_url && (
                  <div className={styles.imgWrap}>
                    <img src={post.media_url} alt={post.titulo} className={styles.img} />
                  </div>
                )}

                <div className={styles.content}>
                  <span className={styles.cat} style={{ background: cc.bg, color: cc.color }}>
                    {catLabel(post.categoria)}
                  </span>

                  <h1 className={styles.title}>{post.titulo}</h1>

                  {post.bajada && <p className={styles.bajada}>{post.bajada}</p>}

                  <div className={styles.meta}>
                    {post.autor && <span className={styles.autor}>Por {post.autor}</span>}
                    <span>📅 {fmtDate(post.created_at)}</span>
                    <span>⏱ {readTime(post.cuerpo)} min de lectura</span>
                  </div>

                  {video && (
                    <div className={styles.videoWrap}>
                      {video.type === 'iframe'
                        ? <iframe src={video.src} title="video" allowFullScreen className={styles.videoFrame} />
                        : <video src={video.src} controls className={styles.videoNative} />
                      }
                    </div>
                  )}

                  {post.cuerpo && (
                    <div className={styles.body}>
                      {renderBody(post.cuerpo, post.imagenes || [])}
                    </div>
                  )}
                </div>
              </article>
            )}
          </main>

          <Sidebar />
        </div>
      </div>

      <Footer />
    </>
  )
}
