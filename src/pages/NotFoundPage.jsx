import { Link, useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 gap-6">
      <span className="text-8xl select-none" role="img" aria-label="mangkuk mie">🍜</span>

      <p
        className="font-heading font-black leading-none"
        style={{ fontSize: 'clamp(6rem, 20vw, 10rem)', color: '#A30D0D' }}
      >
        404
      </p>

      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-gray-800 mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-xs mx-auto">
          Sepertinya kamu nyasar, nih. Yuk balik ke beranda!
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => navigate('/')}
          className="font-bold text-sm px-6 py-3 rounded-xl transition-colors"
          style={{ backgroundColor: '#F4B400', color: '#1A1A1A' }}
        >
          Kembali ke Beranda
        </button>
        <Link
          to="/produk"
          className="font-bold text-sm px-6 py-3 rounded-xl border-2 transition-colors hover:text-white"
          style={{ borderColor: '#A30D0D', color: '#A30D0D' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#A30D0D'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = ''
            e.currentTarget.style.color = '#A30D0D'
          }}
        >
          Lihat Menu
        </Link>
      </div>
    </div>
  )
}
