import { useState, useEffect } from 'react'
import { ShoppingCart, AlertCircle } from 'lucide-react'
import ReviewSection from '../components/review/ReviewSection'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import { formatRupiah } from '../utils/formatCurrency'

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse flex flex-col">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 flex flex-col gap-4">
        {/* Name + desc */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
        </div>
        {/* Toppings */}
        <div className="border-t border-gray-100 pt-4 space-y-2">
          <div className="h-3 bg-gray-100 rounded w-28" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-200 shrink-0" />
                <div className="h-3 bg-gray-100 rounded w-24" />
              </div>
              <div className="h-3 bg-gray-100 rounded w-14" />
            </div>
          ))}
        </div>
        {/* Price + button */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
          <div className="h-7 bg-gray-200 rounded w-28" />
          <div className="h-10 bg-gray-200 rounded-xl w-40" />
        </div>
      </div>
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ menu, toppings, onAddToCart }) {
  const [selectedIds, setSelectedIds] = useState(new Set())

  function toggleTopping(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedToppings = toppings.filter((t) => selectedIds.has(t.id))
  const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0)
  const displayPrice = menu.price + toppingTotal

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">

      {/* ── Gambar ──────────────────────────────────────────────────── */}
      <img
        src={menu.image_url || '/image.png'}
        alt={menu.name}
        className="w-full h-48 object-cover rounded-t-xl"
        onError={(e) => { e.target.src = '/image.png' }}
      />

      <div className="p-5 flex flex-col flex-1 gap-4">

        {/* ── Nama & Deskripsi ─────────────────────────────────────── */}
        <div>
          <h2 className="font-heading text-xl font-bold text-charcoal mb-1.5">
            {menu.name}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {menu.description}
          </p>
        </div>

        {/* ── Pilih Topping ─────────────────────────────────────────── */}
        {toppings.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Tambah Topping
            </p>
            <div className="flex flex-col gap-1.5">
              {toppings.map((topping) => {
                const checked = selectedIds.has(topping.id)
                return (
                  <label
                    key={topping.id}
                    className={[
                      'flex items-center justify-between gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 select-none',
                      checked
                        ? 'bg-primary/10 ring-1 ring-primary/20'
                        : 'hover:bg-gray-50',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTopping(topping.id)}
                        className="w-4 h-4 accent-primary cursor-pointer shrink-0"
                      />
                      <span
                        className={`text-sm ${
                          checked ? 'text-charcoal font-semibold' : 'text-gray-600'
                        }`}
                      >
                        {topping.name}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-semibold shrink-0 ${
                        checked ? 'text-primary' : 'text-gray-400'
                      }`}
                    >
                      +{formatRupiah(topping.price)}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Harga & Tombol ────────────────────────────────────────── */}
        <div className="border-t border-gray-100 pt-4 mt-auto flex items-end justify-between gap-3">
          <div>
            <span className="font-heading text-2xl font-bold text-primary leading-none">
              {formatRupiah(displayPrice)}
            </span>
            {toppingTotal > 0 && (
              <p className="text-[11px] text-gray-400 mt-0.5">
                Sudah termasuk topping
              </p>
            )}
          </div>
          <button
            onClick={() => onAddToCart(menu, selectedToppings)}
            className="flex items-center gap-1.5 bg-accent hover:bg-yellow-400 active:scale-95 text-charcoal text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-150 shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            Tambah ke Keranjang
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Product Page ─────────────────────────────────────────────────────────────

export default function ProductPage() {
  const [menus, setMenus] = useState([])
  const [toppings, setToppings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const { addToCart } = useCart()

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        // Fetch menus dan toppings secara paralel
        const [menusRes, toppingsRes] = await Promise.all([
          supabase
            .from('menus')
            .select('id, name, description, price, image_url, is_available')
            .eq('is_available', true)
            .order('created_at', { ascending: true }),
          supabase
            .from('toppings')
            .select('id, name, price, is_available')
            .eq('is_available', true),
        ])

        if (menusRes.error) throw menusRes.error
        if (toppingsRes.error) throw toppingsRes.error

        if (!cancelled) {
          setMenus(menusRes.data ?? [])
          setToppings(toppingsRes.data ?? [])
        }
      } catch (err) {
        if (!cancelled) setError(err.message ?? 'Gagal memuat data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [retryCount])

  function handleAddToCart(menu, selectedToppings) {
    // Sesuaikan dengan shape yang diharapkan CartContext
    addToCart({
      menuItemId: menu.id,
      name: menu.name,
      basePrice: menu.price,
      toppings: selectedToppings, // [{ id, name, price }]
    })

    const label =
      selectedToppings.length > 0
        ? `${menu.name} + ${selectedToppings.map((t) => t.name).join(', ')}`
        : menu.name

    toast.success(`${label} ditambahkan ke keranjang! 🛒`)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-white mb-2">
            Menu Kami
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Pilih mie, tambahkan topping favoritmu, dan siap Jebew!
          </p>
        </div>
      </div>

      {/* ── Konten Utama ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <p className="text-gray-600 font-medium mb-1">Gagal memuat menu</p>
              <p className="text-gray-400 text-sm max-w-sm">{error}</p>
            </div>
            <button
              onClick={() => setRetryCount((c) => c + 1)}
              className="text-sm font-semibold text-primary underline underline-offset-2 hover:no-underline transition-all"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Data */}
        {!loading && !error && menus.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">Belum ada menu tersedia saat ini.</p>
          </div>
        )}

        {!loading && !error && menus.length > 0 && (
          <div className="space-y-12">
            {menus.map((menu) => (
              <div key={menu.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <ProductCard
                  menu={menu}
                  toppings={toppings}
                  onAddToCart={handleAddToCart}
                />
                <ReviewSection menuId={menu.id} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
