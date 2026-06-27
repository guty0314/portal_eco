import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ── Auth ─────────────────────────────────────────────────────────────────────
export const signIn    = (e, p) => supabase.auth.signInWithPassword({ email: e, password: p }).then(({ data, error }) => { if (error) throw error; return data })
export const signOut   = ()     => supabase.auth.signOut()
export const getSession = ()    => supabase.auth.getSession().then(({ data }) => data.session)
export function onAuthChange(cb) {
  const { data } = supabase.auth.onAuthStateChange((_, s) => cb(s))
  return () => data.subscription.unsubscribe()
}

// ── Posts ─────────────────────────────────────────────────────────────────────
export async function fetchPosts(categoria = null) {
  let q = supabase.from('articulos').select('*').order('created_at', { ascending: false })
  if (categoria) q = q.eq('categoria', categoria)
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function insertPost(post) {
  const { data, error } = await supabase.from('articulos').insert([post]).select().single()
  if (error) throw error
  return data
}

export async function fetchPostById(id) {
  const { data, error } = await supabase.from('articulos').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function updatePost(id, data) {
  const { data: updated, error } = await supabase.from('articulos').update(data).eq('id', id).select().single()
  if (error) throw error
  return updated
}

export async function deletePost(id) {
  const { error } = await supabase.from('articulos').delete().eq('id', id)
  if (error) throw error
}

export async function fetchTips() {
  const { data, error } = await supabase.from('ecotips').select('*').order('orden', { ascending: true })
  if (error) throw error
  return data
}

export async function insertTip(tip) {
  const { data, error } = await supabase.from('ecotips').insert([tip]).select().single()
  if (error) throw error
  return data
}

export async function deleteTip(id) {
  const { error } = await supabase.from('ecotips').delete().eq('id', id)
  if (error) throw error
}

export async function uploadMedia(file) {
  const ext  = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl
}

export function subscribeToPosts({ onInsert, onDelete }) {
  const ch = supabase.channel('articulos-rt')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'articulos' }, p => onInsert?.(p.new))
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'articulos' }, p => onDelete?.(p.old.id))
    .subscribe()
  return () => supabase.removeChannel(ch)
}
