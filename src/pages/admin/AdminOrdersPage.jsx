import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, Phone, MapPin, Package, Clock, Trash2, UtensilsCrossed } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { formatRupiah } from '../../utils/formatCurrency'
import {
  ORDER_STATUS,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
  PICKUP_ESTIMATES,
} from '../../utils/constants'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PICKUP_ETA_LABEL = Object.fromEntries(
  PICKUP_ESTIMATES.map((e) => [e.value, e.label])
)

const FILTER_TABS = [
  { key: 'all', label: 'Semua' },
  { key: ORDER_STATUS.MENUNGGU_VERIFIKASI, label: 'Menunggu' },
  { key: ORDER_STATUS.SEDANG_DISIAPKAN, label: 'Disiapkan' },
  { key: ORDER_STATUS.SIAP_DIAMBIL, label: 'Siap Diambil' },
  { key: ORDER_STATUS.SEDANG_DIANTAR, label: 'Diantar' },
  { key: ORDER_STATUS.SELESAI, label: 'Selesai' },
]

function formatDate(isoString) {
  if (!isoString) return '–'
  const d = new Date(isoString)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [updatingId, setUpdatingId]   = useState(null)

  const fetchOrders = useCallback(async () => {
    const { data, error: sbError } = await supabase
      .from('orders')
      .select(
        'id, customer_name, customer_whatsapp, delivery_method, pickup_eta, ' +
        'delivery_address, subtotal, delivery_fee, total_amount, ' +
        'payment_proof_url, status, created_at'
      )
      .order('created_at', { ascending: false })

    if (sbError) {
      setError(sbError.message)
    } else {
      setOrders(data ?? [])
      setError(null)
    }
    setLoading(false)
  }, [])

  // Initial fetch + auto-refresh setiap 30 detik
  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 30_000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  async function handleDelete(orderId) {
    if (!window.confirm('Hapus pesanan ini dari history?')) return
    const { error: sbError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)
    if (!sbError) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      alert('Pesanan berhasil dihapus')
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingId(orderId)
    const { error: sbError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!sbError) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    }
    setUpdatingId(null)
  }

  const filteredOrders =
    activeFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === activeFilter)

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="bg-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
              Kelola Pesanan
            </h1>
            <p className="text-white/60 text-sm mt-0.5">
              {orders.length} pesanan total
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/menu"
              className="flex items-center gap-1.5 bg-accent hover:bg-yellow-400 text-charcoal text-sm font-bold px-4 py-2 rounded-xl transition-colors"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Kelola Menu
            </Link>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* ── Filter Tabs ──────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.key === 'all'
                ? orders.length
                : orders.filter((o) => o.status === tab.key).length
            const active = activeFilter === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={[
                  'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150',
                  active
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm',
                ].join(' ')}
              >
                {tab.label}
                <span
                  className={[
                    'text-xs px-1.5 py-0.5 rounded-full font-bold',
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-500',
                  ].join(' ')}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Loading ──────────────────────────────────────────────── */}
        {loading && (
          <div className="flex justify-center items-center gap-2 py-20 text-gray-400 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Memuat pesanan…
          </div>
        )}

        {/* ── Error ────────────────────────────────────────────────── */}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-red-500 font-medium mb-2">Gagal memuat pesanan</p>
            <p className="text-gray-400 text-sm mb-5">{error}</p>
            <button
              onClick={fetchOrders}
              className="text-sm font-semibold text-primary underline underline-offset-2"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* ── Empty ────────────────────────────────────────────────── */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            Tidak ada pesanan dengan status ini.
          </div>
        )}

        {/* ── Order Cards ──────────────────────────────────────────── */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                updating={updatingId === order.id}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order, updating, onStatusChange, onDelete }) {
  const isDeletable = order.status === ORDER_STATUS.SELESAI || order.status === ORDER_STATUS.DIBATALKAN
  const isDelivery    = order.delivery_method === 'delivery'
  const statusBadge   = ORDER_STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-600'
  const waNumber      = order.customer_whatsapp?.replace(/^0/, '')

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      {/* ── Nama + Status Badge ─────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-bold text-charcoal leading-tight">
            {order.customer_name}
          </h3>
          <a
            href={`https://wa.me/62${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 transition-colors mt-1"
          >
            <Phone className="w-3.5 h-3.5" />
            {order.customer_whatsapp}
          </a>
        </div>
        <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full ${statusBadge}`}>
          {ORDER_STATUS_LABEL[order.status] ?? order.status}
        </span>
      </div>

      {/* ── Metode + Waktu ──────────────────────────────────────── */}
      <div className="px-5 py-3 bg-gray-50 border-y border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">

        <div className="flex items-start gap-2">
          {isDelivery ? (
            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          ) : (
            <Package className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          )}
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              {isDelivery ? 'Pesan Antar' : 'Take Away'}
            </p>
            <p className="text-charcoal font-medium">
              {isDelivery
                ? (order.delivery_address || '–')
                : (PICKUP_ETA_LABEL[order.pickup_eta] ?? order.pickup_eta ?? '–')}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Dipesan</p>
            <p className="text-charcoal">{formatDate(order.created_at)}</p>
          </div>
        </div>
      </div>

      {/* ── Rincian Harga ───────────────────────────────────────── */}
      <div className="px-5 py-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-500 border-b border-gray-100">
        <span>
          Subtotal:{' '}
          <span className="text-charcoal font-medium">{formatRupiah(order.subtotal)}</span>
        </span>
        {order.delivery_fee > 0 && (
          <span>
            Ongkir:{' '}
            <span className="text-charcoal font-medium">{formatRupiah(order.delivery_fee)}</span>
          </span>
        )}
        <span className="font-heading text-base font-bold text-primary ml-auto">
          Total: {formatRupiah(order.total_amount)}
        </span>
      </div>

      {/* ── Bukti Bayar + Update Status ─────────────────────────── */}
      <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-4">

        {/* Thumbnail bukti bayar */}
        {order.payment_proof_url ? (
          <a
            href={order.payment_proof_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <img
              src={order.payment_proof_url}
              alt="Bukti pembayaran"
              className="w-12 h-12 object-cover rounded-xl border border-gray-200 group-hover:ring-2 group-hover:ring-primary/30"
            />
            <span className="text-xs text-primary font-semibold underline underline-offset-2">
              Lihat bukti bayar
            </span>
          </a>
        ) : (
          <span className="text-xs text-gray-400 italic">Belum ada bukti bayar</span>
        )}

        {/* Dropdown update status + tombol hapus */}
        <div className="flex items-center gap-2 shrink-0">
          {updating && (
            <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
          )}
          <select
            value={order.status}
            disabled={updating}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 cursor-pointer"
          >
            {Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {isDeletable && (
            <button
              onClick={() => onDelete(order.id)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-150"
              aria-label="Hapus pesanan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
