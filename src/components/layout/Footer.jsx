import { Link } from 'react-router-dom'
import { MapPin, Phone, Instagram, Clock } from 'lucide-react'
import { NAV_LINKS, CONTACT_INFO } from '../../utils/constants'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">

        {/* ── Grid Utama ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src="/Logo.png" alt="Titik Pedas" className="h-16 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed italic text-gray-500 mb-4">
              "Nge-Jebew aja dulu,<br />urusan diet nanti aja!"
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href={CONTACT_INFO.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent transition-colors"
                aria-label="Instagram Titik Pedas"
              >
                <Instagram className="w-4 h-4" />
                {CONTACT_INFO.instagram}
              </a>
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div>
            <h3 className="font-heading text-white font-semibold text-lg mb-4">
              Navigasi
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/keranjang"
                  className="text-sm hover:text-accent transition-colors duration-200"
                >
                  Keranjang
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & Jam Buka */}
          <div>
            <h3 className="font-heading text-white font-semibold text-lg mb-4">
              Kontak
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary-light" />
                <span className="leading-relaxed">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0 text-primary-light" />
                <a
                  href={CONTACT_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  {CONTACT_INFO.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 shrink-0 text-primary-light" />
                <span>Senin – Minggu, 10.00 – 21.00 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ──────────────────────────────────────────────────── */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© {year} Titik Pedas. All rights reserved.</p>
          <p>
            Pesan Antar khusus area{' '}
            <span className="text-gray-500">Pasar Baru – UNAND</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
