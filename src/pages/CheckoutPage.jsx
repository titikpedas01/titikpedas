import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Loader2, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../utils/formatCurrency'
import {
  ORDER_TYPE,
  PICKUP_ESTIMATES,
  DELIVERY_FEE,
  MIN_DELIVERY_ITEMS,
  QRIS_NMID,
} from '../utils/constants'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputClass = (hasError = false) =>
  [
    'w-full px-4 py-3 border rounded-xl text-sm text-charcoal placeholder-gray-400',
    'focus:outline-none focus:ring-2 transition-colors duration-150',
    hasError
      ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
      : 'border-gray-200 focus:ring-primary/20 focus:border-primary',
  ].join(' ')

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {title && (
        <h2 className="font-heading text-lg font-bold text-charcoal mb-5">{title}</h2>
      )}
      {children}
    </div>
  )
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  )
}

function SubmitButton({ submitting, disabled }) {
  return (
    <button
      type="submit"
      disabled={submitting || disabled}
      className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-charcoal font-heading font-black text-lg py-4 rounded-2xl transition-all duration-150 active:scale-[0.98] shadow-md"
    >
      {submitting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Memproses...
        </>
      ) : (
        'Konfirmasi Pesanan'
      )}
    </button>
  )
}

function OrderSummaryCard({ cartItems, totalPrice, deliveryFee, grandTotal }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-heading text-lg font-bold text-charcoal mb-4">
        Ringkasan Pesanan
      </h2>

      {/* Item list */}
      <div className="divide-y divide-gray-50 mb-4">
        {cartItems.map((item) => {
          const toppingSum = item.toppings.reduce((s, t) => s + t.price, 0)
          const lineTotal = (item.basePrice + toppingSum) * item.quantity
          return (
            <div
              key={item.cartItemId}
              className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal">
                  {item.name}
                  {item.quantity > 1 && (
                    <span className="text-gray-400 font-normal"> ×{item.quantity}</span>
                  )}
                </p>
                {item.toppings.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    + {item.toppings.map((t) => t.name).join(', ')}
                  </p>
                )}
              </div>
              <span className="text-sm font-semibold text-charcoal shrink-0">
                {formatRupiah(lineTotal)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-100 pt-4 space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="text-charcoal font-medium">{formatRupiah(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Ongkir</span>
          {deliveryFee > 0 ? (
            <span className="text-charcoal font-medium">{formatRupiah(deliveryFee)}</span>
          ) : (
            <span className="text-green-600 font-semibold">Gratis</span>
          )}
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-3">
          <span className="font-heading font-bold text-charcoal">Total</span>
          <span className="font-heading font-bold text-xl text-primary">
            {formatRupiah(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Checkout Page ────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const navigate = useNavigate()
  const {
    cartItems,
    totalPrice,
    deliveryFee,
    grandTotal,
    clearCart,
    orderType,
    setOrderType,
    totalItems,
    isDeliveryEligible,
  } = useCart()

  const { user } = useAuth()

  const [customerName, setCustomerName] = useState('')
  const [customerWhatsapp, setCustomerWhatsapp] = useState('')
  const [pickupEta, setPickupEta] = useState(PICKUP_ESTIMATES[0].value)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [paymentProofFile, setPaymentProofFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [qrisImgError, setQrisImgError] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <div>
          <p className="font-heading text-2xl font-bold text-charcoal mb-1">
            Keranjang kamu kosong
          </p>
          <p className="text-gray-400 text-sm">Belum ada item yang ditambahkan.</p>
        </div>
        <Link
          to="/produk"
          className="mt-2 bg-accent hover:bg-yellow-400 text-charcoal font-bold text-sm px-6 py-3 rounded-xl transition-colors"
        >
          Lihat Menu
        </Link>
      </div>
    )
  }

  // ── File handlers ─────────────────────────────────────────────────────────

  function handleFileChange(e) {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPaymentProofFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setFormErrors((p) => ({ ...p, paymentProof: undefined }))
  }

  function clearFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPaymentProofFile(null)
    setPreviewUrl(null)
  }

  // ── Validation ────────────────────────────────────────────────────────────

  function validate() {
    const errs = {}
    if (!customerName.trim()) {
      console.log('Validasi gagal: customerName kosong')
      errs.customerName = 'Nama pemesan wajib diisi.'
    }
    if (!customerWhatsapp.trim()) {
      console.log('Validasi gagal: customerWhatsapp kosong')
      errs.whatsapp = 'Nomor WhatsApp wajib diisi.'
    }
    if (orderType === ORDER_TYPE.DELIVERY) {
      if (!isDeliveryEligible) {
        console.log('Validasi gagal: jumlah item kurang dari', MIN_DELIVERY_ITEMS)
        errs.method = `Pesan Antar minimal ${MIN_DELIVERY_ITEMS} item.`
      } else if (!deliveryAddress.trim()) {
        console.log('Validasi gagal: deliveryAddress kosong')
        errs.deliveryAddress = 'Detail alamat pengiriman wajib diisi.'
      }
    }
    if (!paymentProofFile) {
      console.log('Validasi gagal: paymentProofFile null (belum upload bukti bayar)')
      errs.paymentProof = 'Bukti pembayaran wajib diunggah.'
    }
    return errs
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  async function uploadPaymentProof(file) {
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${Date.now()}.${ext}`
    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .upload(path, file)
    if (error) throw new Error(`Upload bukti bayar gagal: ${error.message}`)
    return supabase.storage.from('payment-proofs').getPublicUrl(data.path).data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    console.log('1. Submit diklik')
    console.log('Form values:', {
      customerName,
      customerWhatsapp,
      deliveryMethod: orderType,
      pickupEta,
      deliveryAddress,
      paymentProofFile: paymentProofFile ? paymentProofFile.name : null,
    })

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      console.log('Errors yang ditemukan:', errs)
      setFormErrors(errs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    console.log('2. Validasi passed')

    setSubmitting(true)
    try {
      // 1. Upload payment proof ke Supabase Storage bucket 'payment-proofs'
      const paymentProofUrl = await uploadPaymentProof(paymentProofFile)
      console.log('3. Upload bukti bayar:', paymentProofUrl)

      // 2. Insert order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user?.id || null,
          customer_name: customerName.trim(),
          customer_whatsapp: customerWhatsapp.trim(),
          delivery_method: orderType,
          pickup_eta: orderType === ORDER_TYPE.TAKE_AWAY ? pickupEta : null,
          delivery_address:
            orderType === ORDER_TYPE.DELIVERY ? deliveryAddress.trim() : null,
          subtotal: totalPrice,
          delivery_fee: deliveryFee,
          total_amount: grandTotal,
          payment_proof_url: paymentProofUrl,
          status: 'menunggu_verifikasi',
        })
        .select('id')
        .single()
      console.log('4. Insert order response:', order, orderError)

      if (orderError) throw orderError

      // 3. Insert order_items + toppings per item
      for (const item of cartItems) {
        const toppingSum = item.toppings.reduce((s, t) => s + t.price, 0)
        const lineSubtotal = (item.basePrice + toppingSum) * item.quantity

        const { data: orderItem, error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            menu_id: item.menuItemId,
            quantity: item.quantity,
            unit_price: item.basePrice,
            subtotal: lineSubtotal,
          })
          .select('id')
          .single()

        if (itemError) throw itemError

        if (item.toppings.length > 0) {
          const { error: toppingError } = await supabase
            .from('order_item_toppings')
            .insert(
              item.toppings.map((t) => ({
                order_item_id: orderItem.id,
                topping_id: t.id,
                topping_name: t.name,
                topping_price: t.price,
              }))
            )
          if (toppingError) throw toppingError
        }
      }
      console.log('5. Insert order_items selesai')

      // 4. Sukses
      clearCart()
      console.log('6. Navigate ke konfirmasi')
      navigate('/konfirmasi', { state: { orderId: order.id } })
    } catch (err) {
      console.error('handleSubmit error:', err)
      alert(err.message ?? 'Terjadi kesalahan.')
      toast.error(err.message ?? 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const deliveryDisabled = orderType === ORDER_TYPE.DELIVERY && !isDeliveryEligible

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-black text-charcoal mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* ══ Kolom Kiri: form sections ════════════════════════════════ */}
            <div className="lg:col-span-3 space-y-5">

              {/* Ringkasan pesanan — mobile only */}
              <div className="lg:hidden">
                <OrderSummaryCard
                  cartItems={cartItems}
                  totalPrice={totalPrice}
                  deliveryFee={deliveryFee}
                  grandTotal={grandTotal}
                />
              </div>

              {/* ── 1. Data Pemesan ──────────────────────────────────────── */}
              <SectionCard title="Data Pemesan">
                <div className="space-y-4">
                  <FormField label="Nama Pemesan" error={formErrors.customerName}>
                    <input
                      type="text"
                      placeholder="Nama lengkap"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value)
                        setFormErrors((p) => ({ ...p, customerName: undefined }))
                      }}
                      className={inputClass(!!formErrors.customerName)}
                    />
                  </FormField>

                  <FormField label="Nomor WhatsApp Aktif" error={formErrors.whatsapp}>
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={customerWhatsapp}
                      onChange={(e) => {
                        setCustomerWhatsapp(e.target.value)
                        setFormErrors((p) => ({ ...p, whatsapp: undefined }))
                      }}
                      className={inputClass(!!formErrors.whatsapp)}
                    />
                  </FormField>
                </div>
              </SectionCard>

              {/* ── 2. Metode Pembelian ──────────────────────────────────── */}
              <SectionCard title="Metode Pembelian">
                <div className="space-y-3">

                  {/* Radio options */}
                  {[
                    {
                      value: ORDER_TYPE.TAKE_AWAY,
                      emoji: '🥡',
                      label: 'Take Away',
                      desc: 'Ambil sendiri di Jalan Irigasi, Kec. Pauh',
                    },
                    {
                      value: ORDER_TYPE.DELIVERY,
                      emoji: '🛵',
                      label: 'Pesan Antar',
                      desc: `Minimal ${MIN_DELIVERY_ITEMS} item · Ongkir ${formatRupiah(DELIVERY_FEE)}`,
                    },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={[
                        'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors duration-150',
                        orderType === opt.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="orderType"
                        value={opt.value}
                        checked={orderType === opt.value}
                        onChange={() => {
                          setOrderType(opt.value)
                          setFormErrors((p) => ({
                            ...p,
                            method: undefined,
                            deliveryAddress: undefined,
                          }))
                        }}
                        className="mt-0.5 accent-primary shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-charcoal">
                          {opt.emoji} {opt.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}

                  {/* Peringatan minimum item delivery */}
                  {orderType === ORDER_TYPE.DELIVERY && !isDeliveryEligible && (
                    <div className="bg-red-50 rounded-xl px-4 py-3" role="alert">
                      <p className="text-red-600 text-sm">
                        ⚠️ Pesan Antar membutuhkan minimal{' '}
                        <strong>{MIN_DELIVERY_ITEMS} item</strong>. Keranjang kamu
                        saat ini hanya memiliki <strong>{totalItems} item</strong>.
                      </p>
                    </div>
                  )}

                  {/* Take Away → estimasi waktu */}
                  {orderType === ORDER_TYPE.TAKE_AWAY && (
                    <FormField label="Estimasi Waktu Pengambilan">
                      <select
                        value={pickupEta}
                        onChange={(e) => setPickupEta(e.target.value)}
                        className={inputClass(false)}
                      >
                        {PICKUP_ESTIMATES.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  )}

                  {/* Delivery + eligible → input alamat */}
                  {orderType === ORDER_TYPE.DELIVERY && isDeliveryEligible && (
                    <FormField
                      label="Detail Alamat Pengiriman"
                      error={formErrors.deliveryAddress}
                    >
                      <textarea
                        rows={3}
                        placeholder="Nama jalan, nomor rumah, patokan terdekat… (Khusus area Pasar Baru – UNAND)"
                        value={deliveryAddress}
                        onChange={(e) => {
                          setDeliveryAddress(e.target.value)
                          setFormErrors((p) => ({ ...p, deliveryAddress: undefined }))
                        }}
                        className={
                          inputClass(!!formErrors.deliveryAddress) + ' resize-none'
                        }
                      />
                    </FormField>
                  )}
                </div>
              </SectionCard>

              {/* ── 3. Pembayaran QRIS ───────────────────────────────────── */}
              <SectionCard title="Pembayaran QRIS">

                {/* QRIS display */}
                <div className="flex flex-col items-center bg-gray-50 rounded-xl p-6 mb-5">
                  <div className="w-44 h-44 bg-white rounded-xl border border-gray-200 flex items-center justify-center mb-3 overflow-hidden">
                    {qrisImgError ? (
                      <p className="text-gray-300 text-xs text-center px-3 leading-relaxed">
                        Salin QRIS.jpeg ke folder /public agar tampil di sini
                      </p>
                    ) : (
                      <img
                        src="https://zitzenxnmjsgpntdsrqz.supabase.co/storage/v1/object/public/assets/QRIS.jpeg"
                        alt="QRIS Titik Pedas"
                        className="w-full h-full object-contain p-1"
                        onError={() => setQrisImgError(true)}
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-0.5">NMID</p>
                  <p className="font-mono font-bold text-charcoal tracking-wider text-sm">
                    {QRIS_NMID}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 text-center max-w-xs">
                    Scan QRIS, bayar sesuai total, lalu unggah bukti di bawah
                  </p>
                </div>

                {/* Upload bukti bayar */}
                <FormField label="Unggah Bukti Pembayaran" error={formErrors.paymentProof}>
                  <label
                    className={[
                      'flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-150',
                      previewUrl ? 'p-4' : 'py-8 px-4',
                      formErrors.paymentProof
                        ? 'border-red-300 hover:border-red-400 bg-red-50/50'
                        : 'border-gray-300 hover:border-primary hover:bg-primary/5',
                    ].join(' ')}
                  >
                    {previewUrl ? (
                      <div className="relative text-center">
                        <img
                          src={previewUrl}
                          alt="Preview bukti bayar"
                          className="max-h-52 rounded-lg object-cover mx-auto"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            clearFile()
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                          aria-label="Hapus foto"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-gray-400 mt-2 truncate max-w-xs mx-auto">
                          {paymentProofFile?.name}
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-500 font-medium text-center">
                          Klik untuk unggah bukti bayar
                        </span>
                        <span className="text-xs text-gray-400">JPG, PNG, WebP</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </FormField>
              </SectionCard>

              {/* Submit — mobile only (di bawah semua section) */}
              <div className="lg:hidden space-y-3">
                <SubmitButton submitting={submitting} disabled={deliveryDisabled} />
                <p className="text-xs text-gray-400 text-center px-2">
                  Dengan menekan tombol di atas, pesanan kamu akan langsung diproses.
                </p>
              </div>
            </div>

            {/* ══ Kolom Kanan: sticky summary + submit (desktop) ═══════════ */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="sticky top-24 space-y-4">
                <OrderSummaryCard
                  cartItems={cartItems}
                  totalPrice={totalPrice}
                  deliveryFee={deliveryFee}
                  grandTotal={grandTotal}
                />
                <SubmitButton submitting={submitting} disabled={deliveryDisabled} />
                <p className="text-xs text-gray-400 text-center px-2">
                  Dengan menekan tombol di atas, pesanan kamu akan langsung diproses.
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}
