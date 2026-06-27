import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, Plus, Pencil, Trash2, ImageOff, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabaseClient'
import { formatRupiah } from '../../utils/formatCurrency'

// ─── Modal form ───────────────────────────────────────────────────────────────

function MenuModal({ mode, form, onChange, onSave, onClose, saving }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="font-heading text-lg font-bold text-gray-800">
            {mode === 'add' ? 'Tambah Menu' : 'Edit Menu'}
          </h2>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Nama Menu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Contoh: Mie Level 5"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Deskripsi singkat menu…"
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Harga (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => onChange('price', e.target.value)}
              placeholder="25000"
              min="0"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-semibold text-gray-700">Tersedia</p>
              <p className="text-xs text-gray-400">Menu akan tampil di halaman produk</p>
            </div>
            <button
              type="button"
              onClick={() => onChange('is_available', !form.is_available)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                form.is_available ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  form.is_available ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={saving || !form.name.trim() || !form.price}
            className="px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-red-800 rounded-xl transition-colors disabled:opacity-60"
          >
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const EMPTY_FORM = { name: '', description: '', price: '', is_available: true }

export default function AdminMenuPage() {
  const [menus, setMenus]   = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal]   = useState(null)   // null | { mode: 'add'|'edit', id? }
  const [form, setForm]     = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchMenus()
  }, [])

  async function fetchMenus() {
    setLoading(true)
    const { data, error } = await supabase
      .from('menus')
      .select('id, name, description, price, image_url, is_available')
      .order('name', { ascending: true })

    if (error) toast.error('Gagal memuat menu: ' + error.message)
    else setMenus(data ?? [])
    setLoading(false)
  }

  function openAdd() {
    setForm(EMPTY_FORM)
    setModal({ mode: 'add' })
  }

  function openEdit(menu) {
    setForm({
      name:         menu.name,
      description:  menu.description ?? '',
      price:        String(menu.price),
      is_available: menu.is_available,
    })
    setModal({ mode: 'edit', id: menu.id })
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price) return
    setSaving(true)

    const payload = {
      name:         form.name.trim(),
      description:  form.description.trim(),
      price:        Number(form.price),
      is_available: form.is_available,
    }

    let error
    if (modal.mode === 'add') {
      ;({ error } = await supabase.from('menus').insert(payload))
    } else {
      ;({ error } = await supabase.from('menus').update(payload).eq('id', modal.id))
    }

    if (error) {
      toast.error('Gagal menyimpan: ' + error.message)
    } else {
      toast.success(modal.mode === 'add' ? 'Menu berhasil ditambahkan!' : 'Menu berhasil diperbarui!')
      setModal(null)
      fetchMenus()
    }
    setSaving(false)
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Hapus menu "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return

    const { error } = await supabase.from('menus').delete().eq('id', id)
    if (error) toast.error('Gagal menghapus: ' + error.message)
    else {
      toast.success('Menu berhasil dihapus.')
      fetchMenus()
    }
  }

  async function toggleAvailability(menu) {
    const { error } = await supabase
      .from('menus')
      .update({ is_available: !menu.is_available })
      .eq('id', menu.id)

    if (error) toast.error(error.message)
    else {
      setMenus((prev) =>
        prev.map((m) => (m.id === menu.id ? { ...m, is_available: !m.is_available } : m))
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="bg-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Pesanan
            </Link>
            <div className="h-5 w-px bg-white/20" />
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
                Kelola Menu
              </h1>
              <p className="text-white/60 text-sm mt-0.5">{menus.length} menu terdaftar</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMenus}
              disabled={loading}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 bg-accent hover:bg-yellow-400 text-charcoal text-sm font-bold px-4 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Menu
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {loading && (
          <div className="flex justify-center py-20 text-gray-400 gap-2 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" /> Memuat…
          </div>
        )}

        {!loading && menus.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm mb-4">Belum ada menu.</p>
            <button
              onClick={openAdd}
              className="bg-primary text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-red-800 transition-colors"
            >
              + Tambah Menu Pertama
            </button>
          </div>
        )}

        {!loading && menus.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-16">Foto</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Nama</th>
                  <th className="hidden md:table-cell px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Deskripsi</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Harga</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {menus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-gray-50 transition-colors">

                    {/* Foto */}
                    <td className="px-4 py-3">
                      {menu.image_url ? (
                        <img
                          src={menu.image_url}
                          alt={menu.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                          <ImageOff className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                    </td>

                    {/* Nama */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{menu.name}</p>
                    </td>

                    {/* Deskripsi */}
                    <td className="hidden md:table-cell px-4 py-3">
                      <p className="text-gray-500 line-clamp-2 max-w-xs">
                        {menu.description || <span className="italic text-gray-300">–</span>}
                      </p>
                    </td>

                    {/* Harga */}
                    <td className="px-4 py-3">
                      <span className="font-heading font-bold text-primary">
                        {formatRupiah(menu.price)}
                      </span>
                    </td>

                    {/* Status toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvailability(menu)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                          menu.is_available ? 'bg-primary' : 'bg-gray-200'
                        }`}
                        title={menu.is_available ? 'Klik untuk nonaktifkan' : 'Klik untuk aktifkan'}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            menu.is_available ? 'translate-x-[22px]' : 'translate-x-[2px]'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(menu)}
                          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(menu.id, menu.name)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal ───────────────────────────────────────────────────── */}
      {modal && (
        <MenuModal
          mode={modal.mode}
          form={form}
          onChange={handleFormChange}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}
    </div>
  )
}
