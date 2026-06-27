import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, Package, MapPin } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../utils/formatCurrency'
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '../utils/constants'

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return '–'
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderHistoryPage() {
  const { user } = useAuth()
  const [orders, setOrders]       = useState([])
  const [itemsMap, setItemsMap]   = useState({}) // { orderId: [{ name, qty }] }
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  useEffect(() => {
    if (user) fetchOrders()
  }, [user])

  async function fetchOrders() {
    setLoading(true)
    setError(null)
    const { data, error: sbErr } = await supabase
      .from('orders')
      .select('id, created_at, total_amount, status, delivery_method')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })

    if (sbErr) {
      setError(sbErr.message)
      setLoading(false)
      return
    }

    const rows = data ?? []
    setOrders(rows)

    // Fetch order_items + nama menu sekaligus
    if (rows.length > 0) {
      const ids = rows.map((o) => o.id)
      const { data: items } = await supabase
        .from('order_items')
        .select('order_id, quantity, menus(name)')
        .in('order_id', ids)

      const grouped = {}
      for (const item of items ?? []) {
        if (!grouped[item.order_id]) grouped[item.order_id] = []
        grouped[item.order_id].push({
          name: item.menus?.name ?? '–',
          qty: item.quantity,
        })
      }
      setItemsMap(grouped)
    }

    setLoading(false)
  }

  // ── Belum login ─────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Package className="w-10 h-10 text-gray-300" />
        </div>
        <div>
          <p className="font-heading text-xl font-bold text-charcoal mb-1">
            Silakan login untuk melihat riwayat pesanan
          </p>
          <p className="text-gray-400 text-sm">
            Masuk dengan akun kamu untuk melihat semua pesanan yang pernah dibuat.
          </p>
        </div>
        <Link
          to="/login"
          className="bg-accent hover:bg-yellow-400 text-charcoal font-bold text-sm px-6 py-3 rounded-xl transition-colors"
        >
          Login Sekarang
        </Link>
      </div>
    )
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
              Riwayat Pesanan
            </h1>
            <p className="text-white/60 text-sm mt-0.5">{orders.length} pesanan ditemukan</p>
          </div>
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16 text-gray-400 gap-2 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />Memuat…
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-red-500 font-medium mb-2">Gagal memuat riwayat</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="text-sm font-semibold text-primary underline underline-offset-2"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">Belum ada pesanan.</p>
            <Link to="/produk" className="inline-block mt-4 text-primary font-semibold text-sm hover:underline">
              Lihat Menu →
            </Link>
          </div>
        )}

        {/* Order cards */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const badge = ORDER_STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-600'
              const items = itemsMap[order.id] ?? []
              const isDelivery = order.delivery_method === 'delivery'
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm p-5">

                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="font-mono text-xs text-gray-400 mb-0.5">
                        #{order.id.slice(0, 6).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${badge}`}>
                      {ORDER_STATUS_LABEL[order.status] ?? order.status}
                    </span>
                  </div>

                  {/* Item list */}
                  {items.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {items.map((it, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-bold shrink-0">
                            {it.qty}
                          </span>
                          {it.name}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Bottom row */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      {isDelivery ? (
                        <><MapPin className="w-3.5 h-3.5" /> Pesan Antar</>
                      ) : (
                        <><Package className="w-3.5 h-3.5" /> Take Away</>
                      )}
                    </div>
                    <span className="font-heading text-base font-bold text-primary">
                      {formatRupiah(order.total_amount)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
