import { MessageCircle } from 'lucide-react';

export function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/5583986834696?text=Olá, vi o app e gostaria de agendar um serviço"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
      style={{ backgroundColor: '#25D366' }}
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}
