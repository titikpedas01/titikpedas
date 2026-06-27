import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`
}

function StarRow({ value, max = 5, size = 'w-4 h-4', interactive = false, onSet }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => interactive && onSet?.(n)}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            className={`${size} transition-colors ${
              (hover || value) >= n
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-200 fill-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewSection({ menuId }) {
  const { user }              = useAuth()
  const [reviews, setReviews] = useState([])
  const [rating, setRating]   = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError]   = useState(null)
  const [submitted, setSubmitted]   = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [menuId])

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('id, reviewer_name, rating, comment, created_at')
      .eq('menu_id', menuId)
      .eq('is_visible', true)
      .order('created_at', { ascending: false })
    setReviews(data ?? [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (rating === 0) return setFormError('Pilih bintang terlebih dahulu.')
    setFormError(null)
    setSubmitting(true)

    const { error: sbErr } = await supabase.from('reviews').insert({
      menu_id:       menuId,
      customer_id:   user.id,
      reviewer_name: user.email.split('@')[0],
      rating,
      comment:       comment.trim(),
    })

    if (sbErr) {
      setFormError(sbErr.message)
    } else {
      setRating(0)
      setComment('')
      setSubmitted(true)
      fetchReviews()
    }
    setSubmitting(false)
  }

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="mt-6 border-t border-gray-100 pt-6">

      {/* ── Rata-rata ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5">
        <h3 className="font-heading text-base font-bold text-charcoal">Ulasan</h3>
        {avgRating !== null && (
          <div className="flex items-center gap-1.5">
            <StarRow value={Math.round(avgRating)} />
            <span className="text-sm font-semibold text-charcoal">{avgRating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({reviews.length} ulasan)</span>
          </div>
        )}
        {reviews.length === 0 && (
          <span className="text-xs text-gray-400">Belum ada ulasan</span>
        )}
      </div>

      {/* ── List ulasan ──────────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <div className="space-y-4 mb-6">
          {reviews.map((r) => (
            <div key={r.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                {(r.reviewer_name?.[0] ?? '?').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-sm font-semibold text-charcoal">
                    {r.reviewer_name ?? 'Pengguna'}
                  </span>
                  <StarRow value={r.rating} size="w-3 h-3" />
                  <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                </div>
                {r.comment && (
                  <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Form ulasan ──────────────────────────────────────────────── */}
      {user ? (
        submitted ? (
          <p className="text-sm text-green-600 font-medium">
            Ulasan kamu berhasil dikirim! Terima kasih 🙌
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Tulis Ulasan
            </p>

            <StarRow value={rating} size="w-6 h-6" interactive onSet={setRating} />

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Bagikan pengalamanmu…"
              rows={3}
              className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />

            {formError && (
              <p className="text-xs text-red-500">{formError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-red-800 text-white text-sm font-bold px-5 py-2 rounded-xl transition-colors disabled:opacity-60"
            >
              {submitting ? 'Mengirim…' : 'Kirim Ulasan'}
            </button>
          </form>
        )
      ) : (
        <p className="text-sm text-gray-400 italic">
          <a href="/login" className="text-primary font-semibold hover:underline">Login</a>{' '}
          untuk memberikan ulasan.
        </p>
      )}
    </div>
  )
}
