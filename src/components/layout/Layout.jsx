import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from '../ui/WhatsAppButton'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
