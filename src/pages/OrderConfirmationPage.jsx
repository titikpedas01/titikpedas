import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Copy, Check, Search } from 'lucide-react'

export default function OrderConfirmationPage() {
  const location = useLocation()
  const navigate  = useNavigate()
  const { orderId } = location.state ?? {}
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md mx-auto text-center">

        {/* ── Icon centang hijau ─────────────────────────────────────── */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" strokeWidth={1.5} />
        </div>

        {/* ── Heading ───────────────────────────────────────────────── */}
        <h1 className="font-heading text-3xl font-black text-charcoal mb-3">
          Pesanan Berhasil Dikirim!
        </h1>

        {/* ── Sub-teks ──────────────────────────────────────────────── */}
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Pesanan kamu sedang menunggu verifikasi pembayaran oleh admin.
        </p>

        {/* ── Order ID + tombol copy ─────────────────────────────────── */}
        {orderId && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 mb-5 text-left">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1.5">
              Order ID
            </p>
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-sm font-bold text-charcoal break-all">
                {orderId}
              </p>
              <div className="relative group shrink-0">
                <button
                  onClick={handleCopy}
                  aria-label="Salin ID"
                  className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {copied
                    ? <Check className="w-4 h-4 text-green-500" />
                    : <Copy className="w-4 h-4 text-gray-400" />
                  }
                </button>
                {/* Tooltip */}
                <span className="absolute -top-8 right-0 whitespace-nowrap bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Salin ID
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Pantau status ─────────────────────────────────────────── */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-8 text-left">
          <Search className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-700 leading-relaxed mb-3">
              Pantau status pesanan kamu di halaman Cek Pesanan
            </p>
            <button
              onClick={() => navigate('/cek-pesanan')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-xl transition-colors"
            >
              Cek Status Pesanan
            </button>
          </div>
        </div>

        {/* ── Tombol ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/produk')}
            className="flex-1 bg-accent hover:bg-yellow-400 active:scale-[0.98] text-charcoal font-heading font-black text-base py-4 rounded-2xl transition-all duration-150 shadow-md"
          >
            Pesan Lagi
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 border-2 border-primary text-primary hover:bg-primary/5 active:scale-[0.98] font-heading font-bold text-base py-4 rounded-2xl transition-all duration-150"
          >
            Kembali ke Beranda
          </button>
        </div>

      </div>
    </div>
  )
}
