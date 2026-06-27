import { Phone, MapPin, Music, Instagram, Clock, ExternalLink } from 'lucide-react'
import { CONTACT_INFO } from '../utils/constants'

const CONTACT_CARDS = [
  {
    icon: Phone,
    label: 'WhatsApp',
    value: CONTACT_INFO.whatsapp,
    href: CONTACT_INFO.whatsappLink,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: CONTACT_INFO.instagram,
    href: CONTACT_INFO.instagramLink,
    iconColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    icon: Music,
    label: 'TikTok',
    value: CONTACT_INFO.tiktok,
    href: CONTACT_INFO.tiktokLink,
    iconColor: 'text-gray-800',
    bgColor: 'bg-gray-100',
  },
  {
    icon: MapPin,
    label: 'Alamat',
    value: CONTACT_INFO.address,
    href: CONTACT_INFO.mapsLink,
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-white mb-2">
            Hubungi Kami
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Ada pertanyaan atau ingin memesan langsung? Kami siap membantu!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Kiri: info kontak + jam + CTA ───────────────────────── */}
        <div className="space-y-4">

          {/* Kontak cards */}
          {CONTACT_CARDS.map(({ icon: Icon, label, value, href, iconColor, bgColor }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                  {label}
                </p>
                <p className="text-sm font-semibold text-charcoal truncate">{value}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
            </a>
          ))}

          {/* Jam Buka */}
          <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-yellow-50">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                Jam Buka
              </p>
              <p className="text-sm font-semibold text-charcoal">Senin – Minggu</p>
              <p className="text-sm text-gray-500">10.00 – 21.00 WIB</p>
            </div>
          </div>

          {/* CTA WhatsApp */}
          <a
            href={CONTACT_INFO.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-yellow-400 active:scale-[0.98] text-charcoal font-heading font-black text-base py-4 rounded-2xl transition-all duration-150 shadow-md"
          >
            <Phone className="w-5 h-5" />
            Pesan via WhatsApp
          </a>
        </div>

        {/* ── Kanan: Google Maps embed ─────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
          <iframe
            title="Lokasi Titik Pedas"
            src="https://maps.google.com/maps?q=Jalan+Irigasi+Pauh+Padang&output=embed"
            width="100%"
            height="100%"
            className="w-full h-full min-h-[400px] border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </div>
  )
}
