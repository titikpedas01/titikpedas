import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  return (
    <div className="group fixed bottom-6 right-6 z-50 flex items-center">
      {/* Tooltip */}
      <span className="absolute right-16 whitespace-nowrap bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none select-none">
        Chat WhatsApp
      </span>

      <a
        href="https://wa.me/6283182232554"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-colors duration-200"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40" />
        <MessageCircle className="w-7 h-7 text-white relative z-10" />
      </a>
    </div>
  )
}
