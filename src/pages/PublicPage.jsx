import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPosts, subscribeToPosts } from '../lib/supabase'
import Header      from '../components/Header'
import HeroArticle from '../components/HeroArticle'
import ArticleCard from '../components/ArticleCard'
import Sidebar     from '../components/Sidebar'
import Footer      from '../components/Footer'
import Toast       from '../components/Toast'
import { CATEGORIAS } from '../lib/shared'
import styles from './PublicPage.module.css'

export default function PublicPage() {
  const { cat }   = useParams()
  const [posts,   setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [toast,   setToast]   = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchPosts(cat || null)
      .then(data => setPosts(data))
      .finally(() => setLoading(false))
  }, [cat])

  useEffect(() => {
    return subscribeToPosts({
      onInsert: p => setPosts(prev => [p, ...prev]),
      onDelete: id => setPosts(prev => prev.filter(p => p.id !== id)),
    })
  }, [])

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const hero  = posts[0]  || null
  const grid  = posts.slice(1, 5)
  const extra = posts.slice(5)

  const catTitle = cat ? CATEGORIAS.find(c => c.key === cat)?.label : null

  return (
    <>
      <Header isAdmin={false} />

      <div className={styles.wrapper}>
        {catTitle && (
          <div className={styles.catHeader}>
            <h1 className={styles.catTitle}>{catTitle}</h1>
            <span className={styles.catCount}>{posts.length} artículo{posts.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        <div className={styles.layout}>
          {/* Main content */}
          <main className={styles.main}>
            <HeroArticle post={hero} loading={loading} />

            {grid.length > 0 && (
              <div className={styles.grid2}>
                {grid.map((p, i) => (
                  <ArticleCard key={p.id} post={p} isAdmin={false} style={{ animationDelay: `${i * 0.06}s` }} />
                ))}
              </div>
            )}

            {extra.length > 0 && (
              <>
                <div className={styles.sectionDivider}>Más noticias</div>
                <div className={styles.grid3}>
                  {extra.map(p => (
                    <ArticleCard key={p.id} post={p} isAdmin={false} size="small" />
                  ))}
                </div>
              </>
            )}
          </main>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>

      <Footer />
      {toast && <Toast message={toast} />}
    </>
  )
}
