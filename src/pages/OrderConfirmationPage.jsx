import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export default function OrderConfirmationPage() {
  const location = useLocation()
  const navigate  = useNavigate()
  const { orderId } = location.state ?? {}

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

        {/* ── Order ID ──────────────────────────────────────────────── */}
        {orderId && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 mb-5 text-left">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1.5">
              Order ID
            </p>
            <p className="font-mono text-sm font-bold text-charcoal break-all">
              {orderId}
            </p>
          </div>
        )}

        {/* ── Notifikasi WA ─────────────────────────────────────────── */}
        <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-2xl px-5 py-4 mb-8 text-left">
          <span className="text-lg mt-0.5" aria-hidden="true">💬</span>
          <p className="text-sm text-green-700 leading-relaxed">
            Kamu akan mendapat notifikasi WhatsApp saat status pesanan berubah.
          </p>
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
