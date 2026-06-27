import { useState, useEffect } from 'react'
import { fetchTips, insertTip, deleteTip } from '../lib/supabase'
import styles from './EcoTipsModal.module.css'

const ICONOS = ['🌿', '♻️', '💧', '🌱', '☀️', '🐝', '🌍', '🍃', '🌊', '🦋', '🌻', '🐾']

export default function EcoTipsModal({ onClose, showToast }) {
  const [tips,     setTips]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [icono,    setIcono]    = useState('🌿')
  const [titulo,   setTitulo]   = useState('')
  const [desc,     setDesc]     = useState('')
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    fetchTips()
      .then(setTips)
      .catch(() => showToast('Error al cargar los tips.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!titulo.trim()) return
    setSaving(true)
    try {
      const nuevo = await insertTip({ icono, titulo: titulo.trim(), descripcion: desc.trim() || null, orden: tips.length })
      setTips(prev => [...prev, nuevo])
      setTitulo('')
      setDesc('')
      setIcono('🌿')
      showToast('Tip agregado.')
    } catch (e) {
      showToast('Error: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTip(id)
      setTips(prev => prev.filter(t => t.id !== id))
      showToast('Tip eliminado.')
    } catch (e) {
      showToast('Error: ' + e.message)
    }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>🌿 Gestionar Eco Tips</h3>
          <button className={styles.close} onClick={onClose}>×</button>
        </div>

        <div className={styles.body}>
          {/* Lista de tips */}
          <div className={styles.list}>
            {loading && <p className={styles.loading}>Cargando tips...</p>}
            {!loading && tips.length === 0 && <p className={styles.empty}>No hay tips todavía. ¡Agregá el primero!</p>}
            {tips.map(t => (
              <div key={t.id} className={styles.tipRow}>
                <span className={styles.tipIcono}>{t.icono}</span>
                <div className={styles.tipText}>
                  <strong>{t.titulo}</strong>
                  {t.descripcion && <span>{t.descripcion}</span>}
                </div>
                <button className={styles.deleteBtn} onClick={() => handleDelete(t.id)}>×</button>
              </div>
            ))}
          </div>

          {/* Formulario nuevo tip */}
          <form className={styles.form} onSubmit={handleAdd}>
            <div className={styles.formTitle}>Agregar tip</div>

            <div className={styles.iconRow}>
              {ICONOS.map(i => (
                <button key={i} type="button" className={`${styles.iconBtn} ${icono === i ? styles.iconActive : ''}`} onClick={() => setIcono(i)}>{i}</button>
              ))}
            </div>

            <input
              type="text"
              className={styles.input}
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Título del tip *"
              required
            />
            <input
              type="text"
              className={styles.input}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Descripción (opcional)"
            />
            <button type="submit" className={styles.addBtn} disabled={saving || !titulo.trim()}>
              {saving ? 'Agregando...' : '+ Agregar tip'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
