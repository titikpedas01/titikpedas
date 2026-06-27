const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/**
 * Format angka ke format Rupiah.
 * @example formatRupiah(15000) → "Rp 15.000"
 */
export const formatRupiah = (amount) => rupiahFormatter.format(amount)

/**
 * Format angka ke format lokal Indonesia (tanpa simbol mata uang).
 * @example formatNumber(15000) → "15.000"
 */
export const formatNumber = (num) =>
  new Intl.NumberFormat('id-ID').format(num)
