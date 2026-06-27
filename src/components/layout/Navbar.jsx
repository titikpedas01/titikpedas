import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Menu, X, LogIn, LogOut,
  ClipboardList, Package, UtensilsCrossed, ChevronDown,
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { NAV_LINKS, ADMIN_EMAILS } from '../../utils/constants'

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen]     = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const userMenuRef = useRef(null)

  const isAdmin = user && ADMIN_EMAILS.includes(user.email)

  // Tutup semua menu saat route berubah
  useEffect(() => {
    setIsMobileOpen(false)
    setIsDropdownOpen(false)
  }, [location.pathname])

  // Klik di luar dropdown → tutup
  useEffect(() => {
    if (!isDropdownOpen) return
    function handleOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isDropdownOpen])

  async function handleSignOut() {
    setIsDropdownOpen(false)
    await signOut()
    navigate('/')
  }

  const navLinkClass = ({ isActive }) =>
    [
      'relative font-medium text-sm transition-colors duration-200',
      isActive ? 'text-primary' : 'text-gray-600 hover:text-gray-900',
    ].join(' ')

  const mobileNavLinkClass = ({ isActive }) =>
    [
      'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
      isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100',
    ].join(' ')

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="https://zitzenxnmjsgpntdsrqz.supabase.co/storage/v1/object/public/assets/Logo.png" alt="Logo" className="h-12 w-auto object-contain" />
            <span
              className="text-xl font-black hidden sm:block"
              style={{ fontFamily: 'League Spartan', color: '#A30D0D' }}
            >
              Titik Pedas
            </span>
          </Link>

          {/* ── Nav Links — tengah (desktop) ──────────────────────────── */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.path} to={link.path} end={link.end} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/cek-pesanan" className={navLinkClass}>
              Cek Pesanan
            </NavLink>
          </div>

          {/* ── Kanan: keranjang + avatar/login ───────────────────────── */}
          <div className="flex items-center gap-1 shrink-0">

            {/* Ikon Keranjang */}
            <Link
              to="/keranjang"
              className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label={`Keranjang (${totalItems} item)`}
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-accent text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center leading-none" aria-live="polite">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* ── Sudah login: avatar + dropdown ──────────────────────── */}
            {user ? (
              <div className="hidden md:block relative ml-1" ref={userMenuRef}>

                {/* Tombol avatar */}
                <button
                  onClick={() => setIsDropdownOpen((p) => !p)}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold select-none">
                    {user.email[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[90px] truncate">
                    {user.email.split('@')[0]}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50">

                    <Link
                      to="/riwayat"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ClipboardList className="w-4 h-4 text-gray-400 shrink-0" />
                      Riwayat Pesanan
                    </Link>

                    {isAdmin && (
                      <>
                        <Link
                          to="/admin/orders"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Package className="w-4 h-4 text-gray-400 shrink-0" />
                          Kelola Pesanan
                        </Link>
                        <Link
                          to="/admin/menu"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <UtensilsCrossed className="w-4 h-4 text-gray-400 shrink-0" />
                          Kelola Menu
                        </Link>
                      </>
                    )}

                    <div className="my-1 border-t border-gray-100" />

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left rounded-b-2xl"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Belum login ──────────────────────────────────────── */
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 ml-2 bg-primary hover:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setIsMobileOpen((p) => !p)}
              className="md:hidden p-2 ml-1 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label={isMobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ───────────────────────────────────────────── */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 pb-4 flex flex-col gap-1">

            {/* Nav links */}
            {NAV_LINKS.map((link) => (
              <NavLink key={link.path} to={link.path} end={link.end} className={mobileNavLinkClass}>
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/cek-pesanan" className={mobileNavLinkClass}>
              Cek Pesanan
            </NavLink>

            {/* User section */}
            <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-1">
              {user ? (
                <>
                  {/* Info akun */}
                  <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {user.email[0].toUpperCase()}
                    </div>
                    <span className="text-gray-600 text-sm truncate">{user.email}</span>
                  </div>

                  <Link to="/riwayat" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                    <ClipboardList className="w-4 h-4 text-gray-400" />
                    Riwayat Pesanan
                  </Link>

                  {isAdmin && (
                    <>
                      <Link to="/admin/orders" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Package className="w-4 h-4 text-gray-400" />
                        Kelola Pesanan
                      </Link>
                      <Link to="/admin/menu" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <UtensilsCrossed className="w-4 h-4 text-gray-400" />
                        Kelola Menu
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-red-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login / Daftar
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
