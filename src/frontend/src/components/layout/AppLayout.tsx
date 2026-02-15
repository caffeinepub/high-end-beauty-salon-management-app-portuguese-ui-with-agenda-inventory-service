import { type ReactNode } from 'react';
import { type PageView } from '../../App';
import { BrandHeader } from '../brand/BrandHeader';
import { Calendar, Package, Scissors, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SiFacebook, SiInstagram } from 'react-icons/si';

interface AppLayoutProps {
  children: ReactNode;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

const navigationItems = [
  { id: 'agenda' as PageView, label: 'Agenda de Hoje', icon: Calendar },
  { id: 'estoque' as PageView, label: 'Controle de Estoque', icon: Package },
  { id: 'servicos' as PageView, label: 'Catálogo de Serviços', icon: Scissors },
  { id: 'clientes' as PageView, label: 'Fidelidade Clientes', icon: Users },
];

export function AppLayout({ children, currentPage, onNavigate }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col texture-overlay">
      <BrandHeader />
      
      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-sidebar border-r border-sidebar-border">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start gap-3 ${
                    isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Salão de Beleza</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Todos os direitos reservados</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <SiInstagram className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <SiFacebook className="h-4 w-4" />
                </Button>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
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
