import { type PageView } from '../App';
import { HomeHeroCarousel } from '../components/home/HomeHeroCarousel';
import { HomeCategoryGrid } from '../components/home/HomeCategoryGrid';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Carousel */}
      <HomeHeroCarousel />

      {/* Welcome Section */}
      <div className="text-center space-y-2 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Britto Beauty
        </h1>
        <p className="text-muted-foreground text-lg">
          Transforme seu visual com nossos serviços premium
        </p>
      </div>

      {/* Category Grid */}
      <HomeCategoryGrid onNavigate={onNavigate} />

      {/* CTA Section */}
      <div className="bg-card rounded-2xl p-6 sm:p-8 text-center border border-border">
        <h2 className="text-2xl font-bold mb-2">Pronto para transformar seu visual?</h2>
        <p className="text-muted-foreground mb-4">
          Entre em contato e agende seu horário
        </p>
        <a
          href="https://wa.me/5583986834696?text=Olá, vi o app e gostaria de agendar um serviço"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
        >
          Agendar Agora
        </a>
      </div>
    </div>
  );
}
