import { type ReactNode } from 'react';
import { type PageView } from '../../App';
import { BrandHeader } from '../brand/BrandHeader';
import { Home, Scissors, Calendar, User } from 'lucide-react';
import { SiFacebook, SiInstagram } from 'react-icons/si';
import { WhatsAppFloatingButton } from '../home/WhatsAppFloatingButton';

interface AppLayoutProps {
  children: ReactNode;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

const bottomNavItems = [
  { id: 'home' as PageView, label: 'Início', icon: Home },
  { id: 'services' as PageView, label: 'Serviços', icon: Scissors },
  { id: 'appointments' as PageView, label: 'Agenda', icon: Calendar },
  { id: 'profile' as PageView, label: 'Perfil', icon: User },
];

export function AppLayout({ children, currentPage, onNavigate }: AppLayoutProps) {
  const isPrimaryTab = ['home', 'services', 'appointments', 'profile'].includes(currentPage);
  const activeBottomTab = isPrimaryTab ? currentPage : 'profile';

  return (
    <div className="min-h-screen flex flex-col texture-overlay bg-background">
      <BrandHeader />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
          {children}
        </div>
      </main>

      {/* WhatsApp Floating Button */}
      <WhatsAppFloatingButton />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 safe-area-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeBottomTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px] min-h-[48px] ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer - Hidden on mobile, shown on larger screens */}
      <footer className="hidden md:block border-t bg-card mt-auto">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>© {new Date().getFullYear()} Britto Beauty</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  <SiInstagram className="h-4 w-4" />
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  <SiFacebook className="h-4 w-4" />
                </button>
              </div>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                Built with <span className="text-red-500">♥</span> using caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
