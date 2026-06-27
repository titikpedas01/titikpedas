import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock, ChefHat, Package, Truck, CheckCircle, XCircle, Search, Star,
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../utils/formatCurrency'
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '../utils/constants'

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_ICON = {
  menunggu_verifikasi: { Icon: Clock,       color: 'text-yellow-500', bg: 'bg-yellow-50'  },
  sedang_disiapkan:    { Icon: ChefHat,     color: 'text-blue-500',   bg: 'bg-blue-50'    },
  siap_diambil:        { Icon: Package,     color: 'text-green-600',  bg: 'bg-green-50'   },
  sedang_diantar:      { Icon: Truck,       color: 'text-purple-600', bg: 'bg-purple-50'  },
  selesai:             { Icon: CheckCircle, color: 'text-gray-500',   bg: 'bg-gray-100'   },
  dibatalkan:          { Icon: XCircle,     color: 'text-red-500',    bg: 'bg-red-50'     },
}

function formatDate(iso) {
  if (!iso) return '–'
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`
}

// ─── StarInput ────────────────────────────────────────────────────────────────

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              (hover || value) >= n
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderTrackingPage() {
  const { user } = useAuth()
  const [input, setInput]       = useState('')
  const [order, setOrder]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [searched, setSearched] = useState(false)

  // State untuk ulasan
  const [orderItems, setOrderItems] = useState([])
  // { [menu_id]: { rating, comment, submitting, submitted, error } }
  const [reviewForms, setReviewForms] = useState({})

  // Fetch order_items saat status selesai
  useEffect(() => {
    if (order?.status === 'selesai') {
      fetchOrderItems(order.id)
    } else {
      setOrderItems([])
      setReviewForms({})
    }
  }, [order])

  async function fetchOrderItems(orderId) {
    const { data } = await supabase
      .from('order_items')
      .select('menu_id, quantity, menus(name)')
      .eq('order_id', orderId)

    const items = (data ?? []).map((item) => ({
      menu_id:   item.menu_id,
      menu_name: item.menus?.name ?? '–',
      quantity:  item.quantity,
    }))
    setOrderItems(items)

    const initForms = {}
    items.forEach((item) => {
      initForms[item.menu_id] = {
        rating: 0, comment: '', submitting: false, submitted: false, error: null,
      }
    })
    setReviewForms(initForms)
  }

  function updateForm(menuId, patch) {
    setReviewForms((prev) => ({ ...prev, [menuId]: { ...prev[menuId], ...patch } }))
  }

  async function submitReview(menuId) {
    const form = reviewForms[menuId]
    if (!form || form.rating === 0) {
      return updateForm(menuId, { error: 'Pilih bintang terlebih dahulu.' })
    }
    updateForm(menuId, { submitting: true, error: null })

    const { error } = await supabase.from('reviews').insert({
      menu_id:       menuId,
      customer_id:   user.id,
      reviewer_name: user.email.split('@')[0],
      rating:        form.rating,
      comment:       form.comment.trim(),
      is_visible:    true,
    })

    if (error) {
      updateForm(menuId, { submitting: false, error: error.message })
    } else {
      updateForm(menuId, { submitting: false, submitted: true })
    }
  }

  async function handleSearch(e) {
    e.preventDefault()
    const id = input.trim()
    if (!id) return
    setLoading(true)
    setNotFound(false)
    setOrder(null)
    setOrderItems([])
    setReviewForms({})
    setSearched(true)

    const { data, error } = await supabase
      .from('orders')
      .select(
        'id, customer_name, delivery_method, pickup_eta, delivery_address, ' +
        'total_amount, status, created_at'
      )
      .eq('id', id)
      .single()

    if (error || !data) {
      setNotFound(true)
    } else {
      setOrder(data)
    }
    setLoading(false)
  }

  const statusCfg   = order ? (STATUS_ICON[order.status] ?? STATUS_ICON.selesai) : null
  const statusBadge = order ? (ORDER_STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-600') : null
  const isSelesai   = order?.status === 'selesai'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="bg-primary">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h1 className="font-heading text-3xl font-black text-white mb-2">
            Cek Status Pesanan
          </h1>
          <p className="text-white/70 text-sm">
            Masukkan Order ID yang kamu terima setelah checkout.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 space-y-5">

        {/* ── Form search ─────────────────────────────────────────── */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Masukkan Order ID kamu"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center gap-2 bg-primary hover:bg-red-800 text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Mencari…' : 'Cek Status'}
          </button>
        </form>

        {/* ── Not found ───────────────────────────────────────────── */}
        {searched && notFound && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="font-heading font-bold text-charcoal mb-1">Pesanan tidak ditemukan</p>
            <p className="text-sm text-gray-500">
              Pastikan Order ID yang dimasukkan sudah benar.
            </p>
          </div>
        )}

        {/* ── Hasil ───────────────────────────────────────────────── */}
        {order && statusCfg && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            {/* Status visual */}
            <div className={`px-6 py-8 flex flex-col items-center text-center ${statusCfg.bg}`}>
              <div className={`w-16 h-16 rounded-2xl ${statusCfg.bg} border-2 ${statusCfg.color.replace('text-', 'border-')} flex items-center justify-center mb-4`}>
                <statusCfg.Icon className={`w-8 h-8 ${statusCfg.color}`} />
              </div>
              <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${statusBadge}`}>
                {ORDER_STATUS_LABEL[order.status] ?? order.status}
              </span>
            </div>

            {/* Detail */}
            <div className="px-6 py-5 space-y-4 text-sm">
              <DetailRow label="Order ID"  value={<span className="font-mono text-xs">{order.id}</span>} />
              <DetailRow label="Nama"      value={order.customer_name} />
              <DetailRow
                label="Metode"
                value={order.delivery_method === 'delivery' ? 'Pesan Antar' : 'Take Away'}
              />
              {order.delivery_method === 'delivery' && order.delivery_address && (
                <DetailRow label="Alamat" value={order.delivery_address} />
              )}
              <DetailRow label="Tanggal"  value={formatDate(order.created_at)} />
              <DetailRow
                label="Total"
                value={
                  <span className="font-heading text-base font-bold text-primary">
                    {formatRupiah(order.total_amount)}
                  </span>
                }
              />
            </div>
          </div>
        )}

        {/* ── Form ulasan (status selesai) ─────────────────────────── */}
        {order && isSelesai && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-heading text-lg font-bold text-charcoal mb-1">
              Bagaimana pesananmu?
            </h2>
            <p className="text-sm text-gray-400 mb-5">
              Berikan ulasan untuk menu yang kamu pesan.
            </p>

            {!user ? (
              <p className="text-sm text-gray-400 italic">
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Login
                </Link>{' '}
                untuk memberikan ulasan.
              </p>
            ) : orderItems.length === 0 ? (
              <p className="text-sm text-gray-400">Memuat menu…</p>
            ) : (
              <div className="space-y-6">
                {orderItems.map((item) => {
                  const form = reviewForms[item.menu_id]
                  if (!form) return null

                  return (
                    <div key={item.menu_id} className="border border-gray-100 rounded-xl p-4">
                      <p className="font-semibold text-charcoal text-sm mb-3">
                        {item.menu_name}
                        {item.quantity > 1 && (
                          <span className="ml-2 text-xs text-gray-400 font-normal">
                            ×{item.quantity}
                          </span>
                        )}
                      </p>

                      {form.submitted ? (
                        <p className="text-sm text-green-600 font-medium">
                          Ulasan berhasil dikirim! Terima kasih.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          <StarInput
                            value={form.rating}
                            onChange={(n) => updateForm(item.menu_id, { rating: n })}
                          />
                          <textarea
                            value={form.comment}
                            onChange={(e) =>
                              updateForm(item.menu_id, { comment: e.target.value })
                            }
                            placeholder="Komentar (opsional)…"
                            rows={2}
                            className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          />
                          {form.error && (
                            <p className="text-xs text-red-500">{form.error}</p>
                          )}
                          <button
                            onClick={() => submitReview(item.menu_id)}
                            disabled={form.submitting}
                            className="bg-primary hover:bg-red-800 text-white text-sm font-bold px-5 py-2 rounded-xl transition-colors disabled:opacity-60"
                          >
                            {form.submitting ? 'Mengirim…' : 'Kirim Ulasan'}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className="text-charcoal font-medium text-right">{value}</span>
    </div>
  )
}
