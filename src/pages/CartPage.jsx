import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatRupiah } from '../utils/formatCurrency'

export default function CartPage() {
  const navigate = useNavigate()
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice,
  } = useCart()

  // ── Keranjang kosong ────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
          <ShoppingBag className="w-16 h-16 text-gray-300" />
        </div>
        <div>
          <p className="font-heading text-2xl font-bold text-charcoal mb-2">
            Keranjang kamu masih kosong
          </p>
          <p className="text-gray-400 text-sm">
            Yuk, pilih Mie Jebew favorit kamu!
          </p>
        </div>
        <Link
          to="/produk"
          className="bg-accent hover:bg-yellow-400 text-charcoal font-bold text-sm px-6 py-3 rounded-xl transition-colors"
        >
          Lihat Menu
        </Link>
      </div>
    )
  }

  // ── Main ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-black text-charcoal">
            Keranjang
          </h1>
          <span className="text-sm text-gray-400">{totalItems} item</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ══ Kiri: daftar item ══════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const toppingSum = item.toppings.reduce((s, t) => s + t.price, 0)
              const unitTotal   = item.basePrice + toppingSum
              const lineTotal   = unitTotal * item.quantity

              return (
                <div key={item.cartItemId} className="bg-white rounded-2xl shadow-sm p-5">

                  {/* ── Baris atas: nama + hapus ─────────────────────────── */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-heading text-lg font-bold text-charcoal leading-tight">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-150 shrink-0"
                      aria-label={`Hapus ${item.name} dari keranjang`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* ── Topping list ─────────────────────────────────────── */}
                  {item.toppings.length > 0 && (
                    <div className="mt-2.5 space-y-1">
                      {item.toppings.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-gray-500">+ {t.name}</span>
                          <span className="text-gray-400">+{formatRupiah(t.price)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Baris bawah: harga satuan + qty + subtotal ───────── */}
                  <div className="border-t border-gray-100 mt-4 pt-4">

                    {/* Rincian harga satuan */}
                    <p className="text-xs text-gray-400 mb-3">
                      {formatRupiah(item.basePrice)}
                      {toppingSum > 0 && (
                        <span className="mx-1">+ {formatRupiah(toppingSum)} topping</span>
                      )}
                      <span className="font-medium text-gray-500 ml-0.5">
                        = {formatRupiah(unitTotal)}/porsi
                      </span>
                    </p>

                    {/* Qty controls + subtotal */}
                    <div className="flex items-center justify-between gap-3">

                      {/* Tombol − qty + */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          className={[
                            'w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150',
                            item.quantity === 1
                              ? 'bg-red-50 text-red-400 hover:bg-red-100'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                          ].join(' ')}
                          aria-label="Kurangi jumlah"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="w-3.5 h-3.5" />
                          ) : (
                            <Minus className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <span className="w-7 text-center text-sm font-bold text-charcoal">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors duration-150"
                          aria-label="Tambah jumlah"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal per item */}
                      <span className="font-heading text-lg font-bold text-primary">
                        {formatRupiah(lineTotal)}
                      </span>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>

          {/* ══ Kanan: ringkasan & checkout (sticky di desktop) ════════════════ */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-sm p-6 space-y-5">
              <h2 className="font-heading text-lg font-bold text-charcoal">
                Ringkasan
              </h2>

              {/* Baris total */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal ({totalItems} item)
                  </span>
                  <span className="font-medium text-charcoal">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Ongkir</span>
                  <span className="text-xs text-gray-400">Dihitung di checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <span className="font-heading font-bold text-charcoal">Total</span>
                <span className="font-heading font-bold text-xl text-primary">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-yellow-400 active:scale-[0.98] text-charcoal font-heading font-black text-base py-4 rounded-2xl transition-all duration-150 shadow-md"
              >
                Lanjut ke Checkout
                <ChevronRight className="w-5 h-5" />
              </button>

              <Link
                to="/produk"
                className="block text-center text-sm text-primary hover:text-primary-light font-medium transition-colors"
              >
                + Tambah item lain
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
