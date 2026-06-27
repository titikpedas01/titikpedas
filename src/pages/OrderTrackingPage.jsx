import { useState } from 'react'
import {
  Clock, ChefHat, Package, Truck, CheckCircle, XCircle, Search,
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { formatRupiah } from '../utils/formatCurrency'
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '../utils/constants'

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_ICON = {
  menunggu_verifikasi: { Icon: Clock,        color: 'text-yellow-500', bg: 'bg-yellow-50' },
  sedang_disiapkan:    { Icon: ChefHat,      color: 'text-blue-500',   bg: 'bg-blue-50'   },
  siap_diambil:        { Icon: Package,      color: 'text-green-600',  bg: 'bg-green-50'  },
  sedang_diantar:      { Icon: Truck,        color: 'text-purple-600', bg: 'bg-purple-50' },
  selesai:             { Icon: CheckCircle,  color: 'text-gray-500',   bg: 'bg-gray-100'  },
  dibatalkan:          { Icon: XCircle,      color: 'text-red-500',    bg: 'bg-red-50'    },
}

function formatDate(iso) {
  if (!iso) return '–'
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderTrackingPage() {
  const [input, setInput]     = useState('')
  const [order, setOrder]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    const id = input.trim()
    if (!id) return
    setLoading(true)
    setNotFound(false)
    setOrder(null)
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

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Form search ─────────────────────────────────────────── */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
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
              <DetailRow label="Order ID"    value={<span className="font-mono text-xs">{order.id}</span>} />
              <DetailRow label="Nama"        value={order.customer_name} />
              <DetailRow
                label="Metode"
                value={order.delivery_method === 'delivery' ? 'Pesan Antar' : 'Take Away'}
              />
              {order.delivery_method === 'delivery' && order.delivery_address && (
                <DetailRow label="Alamat" value={order.delivery_address} />
              )}
              <DetailRow label="Tanggal"    value={formatDate(order.created_at)} />
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
