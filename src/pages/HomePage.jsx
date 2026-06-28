import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ChevronDown,
  ChefHat,
  Flame,
  Wallet,
  ShoppingCart,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import { formatRupiah } from '../utils/formatCurrency'

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function MenuCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="h-6 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded-xl w-28" />
        </div>
      </div>
    </div>
  )
}

// ─── Menu Card ────────────────────────────────────────────────────────────────

function MenuCard({ item, onAddToCart }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
      <img
        src={item.image_url || 'https://zitzenxnmjsgpntdsrqz.supabase.co/storage/v1/object/public/assets/image.png'}
        alt={item.name}
        className="w-full h-48 object-cover rounded-t-xl"
        onError={(e) => { e.target.src = 'https://zitzenxnmjsgpntdsrqz.supabase.co/storage/v1/object/public/assets/image.png' }}
      />

      {/* Konten */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-xl font-bold text-charcoal mb-1.5">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-5">
          {item.description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <span className="font-heading text-2xl font-bold text-primary leading-none">
            {formatRupiah(item.price)}
          </span>
          <button
            onClick={() => onAddToCart(item)}
            className="flex items-center gap-1.5 bg-accent hover:bg-yellow-400 active:scale-95 text-charcoal text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-150 shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            Tambah
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-8">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 shrink-0">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-heading text-xl font-bold text-charcoal mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{description}</p>
    </div>
  )
}

const FEATURES = [
  {
    icon: ChefHat,
    title: 'Bumbu Rahasia',
    description:
      'Racikan bumbu khas yang tidak bisa kamu temukan di tempat lain. Sekali coba, susah buat move on!',
  },
  {
    icon: Flame,
    title: 'Chili Oil Homemade',
    description:
      'Dibuat segar setiap hari — murni, aromatik, dan hadir dalam 3 level pedas yang bisa kamu pilih sendiri.',
  },
  {
    icon: Wallet,
    title: 'Harga Mahasiswa',
    description:
      'Kenyang, puas, dan dompet tetap aman. Mulai dari Rp 10.000 sudah dapat Mie Jebew yang bikin nagih!',
  },
]

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const { addToCart } = useCart()

  useEffect(() => {
    let cancelled = false

    async function fetchMenuItems() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: sbError } = await supabase
          .from('menus')
          .select('id, name, description, price, image_url, is_available')
          .eq('is_available', true)
          .order('created_at', { ascending: true })

        if (sbError) throw sbError
        if (!cancelled) setMenuItems(data ?? [])
      } catch (err) {
        if (!cancelled) setError(err.message ?? 'Gagal memuat menu.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchMenuItems()
    return () => { cancelled = true }
  }, [retryCount])

  function handleAddToCart(item) {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      basePrice: item.price,
      toppings: [],
    })
    toast.success(`${item.name} ditambahkan ke keranjang! 🛒`)
  }

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════════ */}
      <section className="relative bg-primary min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden">
        {/* Dekorasi blur — tidak interaktif */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-light/30 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-black/25 blur-3xl pointer-events-none"
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            {/* Label kecil */}
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-7 tracking-widest uppercase border border-white/20">
              🔥 Mie Jebew
            </span>

            {/* Heading utama */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.75rem] font-black text-white leading-[1.1] mb-5">
              Lagi lapar tapi{' '}
              <span className="text-accent">bosen</span>{' '}
              sama mie yang itu-itu aja?
            </h1>

            {/* Sub-heading */}
            <p className="font-heading text-2xl sm:text-3xl font-bold text-white/90 mb-3">
              Cobain Mie Jebew!
            </p>

            {/* Tagline */}
            <p className="text-white/60 text-base sm:text-lg italic mb-10">
              "Nge-Jebew aja dulu, urusan diet nanti aja!"
            </p>

            {/* CTA */}
            <Link
              to="/produk"
              className="inline-flex items-center gap-2 bg-accent hover:bg-yellow-400 active:scale-95 text-charcoal font-heading font-black text-lg px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-xl shadow-black/20"
            >
              Pesan Sekarang
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Panah scroll ke bawah */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <ChevronDown className="w-6 h-6 text-white/40" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MENU HIGHLIGHT SECTION
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal mb-3">
              Menu Andalan Kami
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              Pilih level pedas kamu — dari yang bikin senyum sampai yang bikin nangis bahagia.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MenuCardSkeleton />
              <MenuCardSkeleton />
              <MenuCardSkeleton />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <p className="text-gray-600 font-medium mb-1">Gagal memuat menu</p>
                <p className="text-gray-400 text-sm max-w-sm">{error}</p>
              </div>
              <button
                onClick={() => setRetryCount((c) => c + 1)}
                className="mt-1 text-sm font-semibold text-primary underline underline-offset-2 hover:no-underline transition-all"
              >
                Coba lagi
              </button>
            </div>
          )}

          {/* Data */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              <div className="text-center mt-10">
                <Link
                  to="/produk"
                  className="inline-flex items-center gap-1.5 text-primary hover:text-primary-light font-semibold text-sm transition-colors duration-200"
                >
                  Lihat semua menu &amp; pilihan topping
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          KENAPA TITIK PEDAS SECTION
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal mb-3">
              Kenapa Titik Pedas?
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              Bukan cuma pedas — ada alasannya kenapa pelanggan kami selalu balik lagi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
