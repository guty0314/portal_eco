export const CATEGORIAS = [
  { key: 'inicio',     label: 'Inicio'            },
  { key: 'ambiente',   label: 'Ambiente'           },
  { key: 'residuos',   label: 'Residuos'           },
  { key: 'agua',       label: 'Agua y Territorio'  },
  { key: 'educacion',  label: 'Educación Ambiental'},
  { key: 'opinion',    label: 'Opinión'            },
]

export const CAT_COLORS = {
  ambiente:  { bg: '#e8f4e8', color: '#2d6a2d' },
  residuos:  { bg: '#fff3e0', color: '#b35a00' },
  agua:      { bg: '#e3f2fd', color: '#0d5a8a' },
  educacion: { bg: '#f3e5f5', color: '#6a1b9a' },
  opinion:   { bg: '#fce4ec', color: '#880e4f' },
  inicio:    { bg: '#e8f4e8', color: '#2d6a2d' },
}

export function readTime(text = '') {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export function getVideoEmbed(url) {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/)
  if (yt) return { type: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}` }
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}` }
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { type: 'video', src: url }
  return null
}
