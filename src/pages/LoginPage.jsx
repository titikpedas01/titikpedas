import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { ADMIN_EMAILS } from '../utils/constants'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toEmail = (username) => username.trim().toLowerCase() + '@titikpedas.store'

const inputBase =
  'w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-charcoal ' +
  'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 ' +
  'focus:border-primary transition-colors duration-150'

function FieldIcon({ icon: Icon }) {
  return (
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      <Icon className="w-4 h-4" />
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'

  // Fields
  const [fullName, setFullName]       = useState('')
  const [username, setUsername]       = useState('')
  const [password, setPassword]       = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  // UI state
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [success, setSuccess]         = useState(null)

  function switchMode(next) {
    setMode(next)
    setError(null)
    setSuccess(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!username.trim()) return setError('Username wajib diisi.')

    if (mode === 'register') {
      if (!fullName.trim())        return setError('Nama lengkap wajib diisi.')
      if (password.length < 6)     return setError('Password minimal 6 karakter.')
      if (password !== confirmPass) return setError('Konfirmasi password tidak cocok.')
    }

    setLoading(true)
    try {
      const emailToSend = toEmail(username)

      if (mode === 'login') {
        console.log('Email yang dikirim ke Supabase:', emailToSend)
        const { data, error: authErr } = await supabase.auth.signInWithPassword({ email: emailToSend, password })
        if (authErr) throw authErr
        if (ADMIN_EMAILS.includes(data.user?.email)) {
          navigate('/admin/orders')
        } else {
          navigate('/')
        }
      } else {
        const { data, error: authErr } = await supabase.auth.signUp({
          email: emailToSend,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              username:  username.trim().toLowerCase(),
            },
          },
        })
        if (authErr) throw authErr
        if (data.user && !data.session) {
          setSuccess('Akun berhasil dibuat! Silakan masuk.')
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      setError(err.message ?? 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-sm">

        {/* ── Logo ────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/Logo.png"
            alt="Titik Pedas"
            className="w-24 h-24 object-contain mb-2"
          />
          <span className="text-2xl font-black" style={{ fontFamily: 'League Spartan', color: '#A30D0D' }}>
            Titik Pedas
          </span>
        </div>

        {/* ── Card ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-8">

          {/* Heading */}
          <h1 className="font-heading text-xl font-bold text-charcoal mb-1">
            {mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru'}
          </h1>
          <p className="text-gray-400 text-xs mb-6 leading-relaxed">
            {mode === 'login'
              ? 'Login untuk memberikan ulasan pada menu favorit kamu'
              : 'Daftar untuk mulai memesan dan memberikan ulasan'}
          </p>

          {/* Notifikasi error/sukses */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-5">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Nama Lengkap — register only */}
            {mode === 'register' && (
              <div className="relative">
                <FieldIcon icon={User} />
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputBase}
                  required
                />
              </div>
            )}

            {/* Username */}
            <div>
              <div className="relative">
                <FieldIcon icon={User} />
                <input
                  type="text"
                  placeholder="Contoh: budi123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputBase}
                  autoComplete="username"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 pl-1">Username digunakan untuk login</p>
            </div>

            {/* Password */}
            <div className="relative">
              <FieldIcon icon={Lock} />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputBase + ' pr-10'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Konfirmasi Password — register only */}
            {mode === 'register' && (
              <div className="relative">
                <FieldIcon icon={Lock} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Konfirmasi Password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className={inputBase + ' pr-10'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-red-800 active:scale-[0.98] text-white font-heading font-black text-base py-3.5 rounded-xl transition-all duration-150 disabled:opacity-60 mt-2"
            >
              {loading
                ? (mode === 'login' ? 'Masuk...' : 'Mendaftar...')
                : (mode === 'login' ? 'Masuk' : 'Daftar')}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-sm text-gray-500 mt-5">
            {mode === 'login' ? (
              <>
                Belum punya akun?{' '}
                <button
                  onClick={() => switchMode('register')}
                  className="text-primary font-semibold hover:underline underline-offset-2"
                >
                  Daftar
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-primary font-semibold hover:underline underline-offset-2"
                >
                  Masuk
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
