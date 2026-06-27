import { useState, useEffect, useCallback } from 'react'
import { fetchPosts, deletePost, signOut } from '../lib/supabase'
import AdminSidebar  from '../components/AdminSidebar'
import PublishModal  from '../components/PublishModal'
import EcoTipsModal  from '../components/EcoTipsModal'
import Toast         from '../components/Toast'
import { CATEGORIAS, CAT_COLORS } from '../lib/shared'
import styles from './AdminPage.module.css'

function fmtDate(ts) {
  try {
    return new Date(ts).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
  } catch { return '' }
}

export default function AdminPage({ session }) {
  const [posts,        setPosts]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [toast,        setToast]        = useState(null)
  const [modal,        setModal]        = useState(false)
  const [editingPost,  setEditingPost]  = useState(null)
  const [tipsModal,    setTipsModal]    = useState(false)
  const [search,       setSearch]       = useState('')
  const [activeFilter, setActiveFilter] = useState('todas')

  useEffect(() => {
    fetchPosts().then(setPosts).finally(() => setLoading(false))
  }, [])

  const showToast = useCallback(msg => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este artículo?')) return
    try {
      await deletePost(id)
      setPosts(prev => prev.filter(p => p.id !== id))
      showToast('Artículo eliminado.')
    } catch (e) { showToast('Error: ' + e.message) }
  }

  function handleEdit(post) {
    setEditingPost(post)
    setModal(true)
  }

  function handleModalClose() {
    setModal(false)
    setEditingPost(null)
    fetchPosts().then(setPosts).catch(() => {})
  }

  const cats = CATEGORIAS.filter(c => c.key !== 'inicio')

  const stats = cats.map(c => ({
    ...c,
    count: posts.filter(p => p.categoria === c.key).length,
  }))

  const filtered = posts.filter(p => {
    const matchCat = activeFilter === 'todas' || p.categoria === activeFilter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      p.titulo?.toLowerCase().includes(q) ||
      p.autor?.toLowerCase().includes(q) ||
      p.cuerpo?.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  return (
    <div className={styles.layout}>
      <AdminSidebar
        userEmail={session.user.email}
        onSignOut={signOut}
        onTips={() => setTipsModal(true)}
      />

      <main className={styles.main}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>Noticias</h1>
            <p className={styles.subtitle}>{posts.length} publicaciones en total</p>
          </div>
          <button className={styles.newBtn} onClick={() => { setEditingPost(null); setModal(true) }}>
            + Nueva noticia
          </button>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {stats.map(s => (
            <div
              key={s.key}
              className={`${styles.statCard} ${activeFilter === s.key ? styles.statActive : ''}`}
              onClick={() => setActiveFilter(activeFilter === s.key ? 'todas' : s.key)}
            >
              <div className={styles.statNum}>{s.count}</div>
              <div className={styles.statLabel}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.search}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por título, autor o contenido..."
            />
          </div>
          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${activeFilter === 'todas' ? styles.filterActive : ''}`}
              onClick={() => setActiveFilter('todas')}
            >Todas</button>
            {stats.map(s => (
              <button
                key={s.key}
                className={`${styles.filterBtn} ${activeFilter === s.key ? styles.filterActive : ''}`}
                onClick={() => setActiveFilter(activeFilter === s.key ? 'todas' : s.key)}
              >
                {s.label}
                {s.count > 0 && <span className={styles.filterCount}>{s.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrap}>
          {loading ? (
            <div className={styles.empty}>Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              {search || activeFilter !== 'todas'
                ? 'No hay artículos que coincidan con los filtros.'
                : '¡Publicá el primer artículo!'}
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>IMAGEN</th>
                  <th>CATEGORÍA</th>
                  <th>TÍTULO</th>
                  <th>AUTOR</th>
                  <th>FECHA</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const cc = CAT_COLORS[p.categoria] || CAT_COLORS.ambiente
                  const catLabel = CATEGORIAS.find(c => c.key === p.categoria)?.label || p.categoria
                  return (
                    <tr key={p.id}>
                      <td>
                        {p.media_url
                          ? <img src={p.media_url} alt="" className={styles.thumb} />
                          : <div className={styles.thumbEmpty}>🌿</div>
                        }
                      </td>
                      <td>
                        <span className={styles.catBadge} style={{ background: cc.bg, color: cc.color }}>
                          {catLabel}
                        </span>
                      </td>
                      <td>
                        <div className={styles.titleCell}>{p.titulo}</div>
                        {p.bajada && <div className={styles.bajadaCell}>{p.bajada}</div>}
                      </td>
                      <td className={styles.autorCell}>{p.autor || '—'}</td>
                      <td className={styles.fechaCell}>{fmtDate(p.created_at)}</td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.editBtn} onClick={() => handleEdit(p)}>✎ Editar</button>
                          <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>×</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className={styles.showing}>Mostrando {filtered.length} de {posts.length} noticias</p>
      </main>

      {modal     && <PublishModal onClose={handleModalClose} showToast={showToast} post={editingPost} />}
      {tipsModal && <EcoTipsModal onClose={() => setTipsModal(false)} showToast={showToast} />}
      {toast     && <Toast message={toast} />}
    </div>
  )
}
