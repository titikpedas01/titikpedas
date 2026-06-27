import { ChefHat, Flame, Heart, MapPin } from 'lucide-react'
import { CONTACT_INFO } from '../utils/constants'

const COMMITMENTS = [
  {
    icon: ChefHat,
    title: 'Bumbu Rahasia',
    desc: 'Racikan bumbu khas yang tidak sembarangan — diwariskan lewat pengalaman dan disempurnakan setiap hari. Sekali coba, susah buat move on.',
  },
  {
    icon: Flame,
    title: 'Chili Oil Homemade',
    desc: 'Dibuat sendiri setiap hari dari bahan pilihan — murni, aromatik, dan hadir dalam 3 level pedas yang bisa disesuaikan dengan selera kamu.',
  },
  {
    icon: Heart,
    title: 'Untuk Mahasiswa',
    desc: 'Harga terjangkau, rasa bintang lima. Kami percaya makanan lezat seharusnya bisa dinikmati semua kalangan tanpa harus menguras kantong.',
  },
]

export default function AboutPage() {
  return (
    <div>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <div className="bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-white mb-4">
            Tentang Kami
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto">
            Mie Jebew Padang yang lahir dari dapur sederhana dengan semangat yang tidak pernah padam.
          </p>
        </div>
      </div>

      {/* ── Kisah ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-charcoal mb-6">
            Kisah Titik Pedas
          </h2>
          <div className="space-y-5 text-gray-600 leading-relaxed text-base">
            <p>
              Titik Pedas lahir dari kecintaan mendalam terhadap kuliner Padang dan semangat untuk
              menyajikan cita rasa autentik di tengah kesibukan sehari-hari. Bermula dari dapur
              sederhana di sudut kota Padang, kami berkomitmen menghadirkan mie jebew yang tidak
              hanya menggoyang lidah, tetapi juga ramah di kantong — terutama untuk para mahasiswa.
            </p>
            <p>
              Nama <strong className="text-charcoal">"Titik Pedas"</strong> bukan sekadar nama —
              ini adalah filosofi. Setiap sajian kami adalah titik pertemuan antara tradisi dan
              kreasi: bumbu Minang yang otentik bertemu dengan inovasi modern. Dari satu mangkuk ke
              mangkuk berikutnya, kami terus belajar, terus berkembang, dan terus bersemangat.
            </p>
            <p>
              Dari yang awalnya melayani lingkungan sekitar, kini Titik Pedas telah menjadi pilihan
              favorit banyak pelanggan setia. Perjalanan ini bukan hanya tentang bisnis — ini
              tentang berbagi kebahagiaan lewat semangkuk mie yang penuh rasa.
            </p>
          </div>
        </div>
      </section>

      {/* ── Komitmen ────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-charcoal mb-3">
              Komitmen Kami
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Tiga pilar yang menjadi fondasi Titik Pedas sejak hari pertama.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMMITMENTS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-7 shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-charcoal mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Makna Logo ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <img
            src="https://zitzenxnmjsgpntdsrqz.supabase.co/storage/v1/object/public/assets/Logo.png"
            alt="Logo Titik Pedas"
            className="w-48 h-48 object-contain mx-auto shrink-0"
          />
          <div>
            <h2 className="font-heading text-3xl font-bold text-charcoal mb-4">
              Makna Logo
            </h2>
            <p className="text-gray-600 leading-relaxed text-base mb-4">
              Mangkuk merah dalam logo kami bukan sekadar simbol makanan — ini adalah
              representasi <strong className="text-primary">semangat dan keberanian</strong>.
              Warna merah melambangkan keberanian untuk bermimpi besar, semangat dalam berkarya,
              dan kehangatan yang kami hadirkan dalam setiap sajian.
            </p>
            <p className="text-gray-600 leading-relaxed text-base">
              Seperti mangkuk yang selalu siap diisi, kami selalu siap melayani dengan sepenuh
              hati. Setiap hari adalah kesempatan baru untuk membuat pelanggan tersenyum lewat
              semangkuk mie yang lezat.
            </p>
          </div>
        </div>
      </section>

      {/* ── Lokasi ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-3">
            Temukan Kami
          </h2>
          <p className="text-gray-600 text-base">{CONTACT_INFO.address}</p>
          <a
            href={CONTACT_INFO.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-5 text-primary font-semibold text-sm hover:underline underline-offset-2"
          >
            Buka di Google Maps →
          </a>
        </div>
      </section>

    </div>
  )
}
