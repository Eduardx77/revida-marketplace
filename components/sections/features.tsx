import { Card } from '@/components/ui/card';
import { Leaf, MessageCircle, Shield, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Sustentabilidad',
    description: 'Cada intercambio reduce desperdicio y ayuda al planeta. Acciones individuales, impacto colectivo.'
  },
  {
    icon: Shield,
    title: 'Comunidad Segura',
    description: 'Verificación de usuarios, reseñas y moderación para garantizar confianza en la plataforma.'
  },
  {
    icon: MessageCircle,
    title: 'Mensajería Integrada',
    description: 'Comunícate directamente con otros usuarios para coordinar intercambios y donaciones.'
  },
  {
    icon: TrendingUp,
    title: 'Impacto Medible',
    description: 'Visualiza tu contribución al cuidado ambiental con estadísticas personalizadas.'
  }
];

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Por Qué Elegir ReVida
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto text-pretty">
            Una plataforma diseñada pensando en ti y en el planeta
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title}
                className="group p-6 sm:p-8 border border-border hover:border-primary/30 hover:bg-accent/20 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/60 text-sm sm:text-base mt-2 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
