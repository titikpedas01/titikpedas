// ─── Order Status ────────────────────────────────────────────────────────────

export const ORDER_STATUS = {
  MENUNGGU_VERIFIKASI: 'menunggu_verifikasi',
  SEDANG_DISIAPKAN: 'sedang_disiapkan',
  SIAP_DIAMBIL: 'siap_diambil',
  SEDANG_DIANTAR: 'sedang_diantar',
  SELESAI: 'selesai',
  DIBATALKAN: 'dibatalkan',
}

export const ORDER_STATUS_LABEL = {
  menunggu_verifikasi: 'Menunggu Verifikasi',
  sedang_disiapkan: 'Sedang Disiapkan',
  siap_diambil: 'Siap Diambil',
  sedang_diantar: 'Sedang Diantar',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
}

// Badge color class (Tailwind) per status
export const ORDER_STATUS_COLOR = {
  menunggu_verifikasi: 'bg-yellow-100 text-yellow-800',
  sedang_disiapkan: 'bg-blue-100 text-blue-800',
  siap_diambil: 'bg-green-100 text-green-800',
  sedang_diantar: 'bg-purple-100 text-purple-800',
  selesai: 'bg-gray-100 text-gray-700',
  dibatalkan: 'bg-red-100 text-red-800',
}

// ─── Order Type ───────────────────────────────────────────────────────────────

export const ORDER_TYPE = {
  TAKE_AWAY: 'take_away',
  DELIVERY: 'delivery',
}

// ─── Pickup Estimate (Take Away) ──────────────────────────────────────────────

export const PICKUP_ESTIMATES = [
  { value: 'secepatnya', label: 'Secepatnya' },
  { value: '15_menit', label: '15 Menit' },
  { value: '30_menit', label: '30 Menit' },
  { value: '1_jam', label: '1 Jam' },
]

// ─── Delivery Rules ───────────────────────────────────────────────────────────

export const DELIVERY_FEE = 2000       // Rp 2.000 flat
export const MIN_DELIVERY_ITEMS = 3    // minimal 3 box/porsi

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: 'Beranda', path: '/', end: true },
  { label: 'Produk', path: '/produk', end: false },
  { label: 'Tentang Kami', path: '/tentang', end: false },
  { label: 'Kontak', path: '/kontak', end: false },
]

// ─── Brand / Contact Info ─────────────────────────────────────────────────────

export const CONTACT_INFO = {
  whatsapp: '083182232554',
  whatsappLink: 'https://wa.me/6283182232554',
  instagram: '@titikpedas27',
  instagramLink: 'https://instagram.com/titikpedas27',
  tiktok: '@titikpedas',
  tiktokLink: 'https://tiktok.com/@titikpedas',
  address: 'Jalan Irigasi, Kec. Pauh, Kota Padang, Sumatera Barat',
  mapsLink: 'https://maps.app.goo.gl/YourLinkHere',
}

// ─── QRIS ────────────────────────────────────────────────────────────────────

export const QRIS_NMID = 'ID1026502174901'

// ─── Admin ───────────────────────────────────────────────────────────────────

export const ADMIN_EMAILS = ['admin@titikpedas.store']
