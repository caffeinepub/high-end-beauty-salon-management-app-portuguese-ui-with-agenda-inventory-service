import { type PageView } from '../../App';
import { Sparkles, Scissors, Heart, Calendar } from 'lucide-react';

interface HomeCategoryGridProps {
  onNavigate: (page: PageView) => void;
}

const categories = [
  {
    id: 'services',
    title: 'Mechas',
    icon: '/assets/generated/icon-highlights.dim_256x256.png',
    fallbackIcon: Sparkles,
    action: 'services' as PageView,
  },
  {
    id: 'haircut',
    title: 'Corte',
    icon: '/assets/generated/icon-haircut.dim_256x256.png',
    fallbackIcon: Scissors,
    action: 'services' as PageView,
  },
  {
    id: 'treatments',
    title: 'Tratamentos',
    icon: '/assets/generated/icon-treatments.dim_256x256.png',
    fallbackIcon: Heart,
    action: 'services' as PageView,
  },
  {
    id: 'agenda',
    title: 'Agenda',
    icon: '/assets/generated/icon-agenda.dim_256x256.png',
    fallbackIcon: Calendar,
    action: 'appointments' as PageView,
  },
];

export function HomeCategoryGrid({ onNavigate }: HomeCategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 px-2">
      {categories.map((category) => {
        const FallbackIcon = category.fallbackIcon;
        return (
          <button
            key={category.id}
            onClick={() => onNavigate(category.action)}
            className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <img
                  src={category.icon}
                  alt={category.title}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <FallbackIcon className="w-10 h-10 text-primary hidden" />
              </div>
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {category.title}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
