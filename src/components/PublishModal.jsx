import { useState, useEffect, useRef } from 'react'
import { insertPost, updatePost, uploadMedia } from '../lib/supabase'
import { CATEGORIAS } from '../lib/shared'
import styles from './PublishModal.module.css'

export default function PublishModal({ onClose, showToast, post = null }) {
  const isEdit = !!post

  const [titulo,    setTitulo]    = useState(post?.titulo    || '')
  const [bajada,    setBajada]    = useState(post?.bajada    || '')
  const [cuerpo,    setCuerpo]    = useState(post?.cuerpo    || '')
  const [autor,     setAutor]     = useState(post?.autor     || '')
  const [categoria, setCategoria] = useState(post?.categoria || 'ambiente')
  const [videoUrl,  setVideoUrl]  = useState(post?.video_url || '')
  const [file,      setFile]      = useState(null)
  const [loading,   setLoading]   = useState(false)

  // Imágenes adicionales: [{ url: string, file: File|null }]
  const [extraImgs, setExtraImgs] = useState(
    (post?.imagenes || []).map(url => ({ url, file: null }))
  )
  const extraInputRef = useRef()

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleExtraFile(e) {
    const f = e.target.files[0]
    if (!f) return
    const preview = URL.createObjectURL(f)
    setExtraImgs(prev => [...prev, { url: preview, file: f }])
    e.target.value = ''
  }

  function removeExtra(idx) {
    setExtraImgs(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!titulo.trim()) { showToast('El título es obligatorio.'); return }
    setLoading(true)
    try {
      let media_url = post?.media_url ?? null
      if (file) media_url = await uploadMedia(file)

      // Subir imágenes adicionales nuevas
      const imagenes = await Promise.all(
        extraImgs.map(img => img.file ? uploadMedia(img.file) : Promise.resolve(img.url))
      )

      const data = {
        titulo:    titulo.trim(),
        bajada:    bajada.trim()   || null,
        cuerpo:    cuerpo.trim()   || null,
        autor:     autor.trim()    || 'Redacción EcoJuy',
        categoria,
        media_url,
        video_url: videoUrl.trim() || null,
        imagenes,
      }

      if (isEdit) {
        await updatePost(post.id, data)
        showToast('Artículo actualizado.')
      } else {
        await insertPost(data)
        showToast('Artículo publicado.')
      }
      onClose()
    } catch (e) {
      showToast('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const cats = CATEGORIAS.filter(c => c.key !== 'inicio')

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <img src="https://jinewleiekzfyatuxegn.supabase.co/storage/v1/object/public/media/logo.jpeg" alt="EcoJuy" className={styles.headerLogo} />
            <h3>{isEdit ? 'Editar artículo' : 'Nuevo artículo'}</h3>
          </div>
          <button className={styles.close} onClick={onClose}>×</button>
        </div>
        <form className={styles.body} onSubmit={handleSubmit}>

          <div className={styles.field}>
            <label>Categoría</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)}>
              {cats.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>

          <div className={styles.field}>
            <label>Título *</label>
            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título del artículo..." autoFocus required />
          </div>

          <div className={styles.field}>
            <label>Bajada (resumen)</label>
            <input type="text" value={bajada} onChange={e => setBajada(e.target.value)} placeholder="Breve descripción que aparece debajo del título..." />
          </div>

          <div className={styles.field}>
            <label>Cuerpo del artículo</label>
            <textarea value={cuerpo} onChange={e => setCuerpo(e.target.value)} placeholder="Escribí el artículo completo aquí..." />
          </div>

          {/* Imágenes adicionales */}
          <div className={styles.field}>
            <label>Imágenes en el artículo <span className={styles.labelNote}>(se intercalan entre párrafos)</span></label>
            {extraImgs.length > 0 && (
              <div className={styles.extraGrid}>
                {extraImgs.map((img, i) => (
                  <div key={i} className={styles.extraThumb}>
                    <img src={img.url} alt="" />
                    <button type="button" className={styles.removeThumb} onClick={() => removeExtra(i)}>×</button>
                    <span className={styles.thumbNum}>{i + 1}</span>
                  </div>
                ))}
              </div>
            )}
            <input
              ref={extraInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleExtraFile}
            />
            <button type="button" className={styles.addImgBtn} onClick={() => extraInputRef.current.click()}>
              + Agregar imagen
            </button>
          </div>

          <div className={styles.field}>
            <label>Autor</label>
            <input type="text" value={autor} onChange={e => setAutor(e.target.value)} placeholder="Nombre del autor..." />
          </div>

          <div className={styles.field}>
            <label>Enlace de video (YouTube, Vimeo o .mp4)</label>
            <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          </div>

          <div className={styles.field}>
            <label>Imagen destacada{isEdit && post?.media_url ? ' (dejá vacío para mantener la actual)' : ''}</label>
            <label className={styles.fileUpload}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0] || null)} />
              <div className={styles.fileText}>
                <strong>{file ? '✓ ' + file.name : isEdit && post?.media_url ? '✓ Imagen actual guardada' : 'Subir imagen'}</strong>
                {!file && !post?.media_url && <span>JPG, PNG, WEBP</span>}
              </div>
            </label>
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? (isEdit ? 'Guardando...' : 'Publicando...') : (isEdit ? 'Guardar cambios →' : 'Publicar artículo →')}
          </button>
        </form>
      </div>
    </div>
  )
}
