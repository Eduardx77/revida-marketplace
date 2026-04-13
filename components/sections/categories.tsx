import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Shirt, Sofa, Zap } from 'lucide-react';

const categories = [
  {
    icon: Shirt,
    name: 'Ropa y Accesorios',
    count: '342 items',
    description: 'Prendas, zapatos y accesorios en buen estado'
  },
  {
    icon: Sofa,
    name: 'Muebles',
    count: '156 items',
    description: 'Sillas, mesas, estantes y más'
  },
  {
    icon: BookOpen,
    name: 'Libros y Educación',
    count: '523 items',
    description: 'Libros, revistas y material educativo'
  },
  {
    icon: Zap,
    name: 'Electrónica',
    count: '89 items',
    description: 'Aparatos, cables y equipos funcionando'
  }
];

export function Categories() {
  return (
    <section id="categories" className="py-16 sm:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <Badge variant="secondary" className="mx-auto">
            Categorías Destacadas
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-balance">
            ¿Qué Estás Buscando?
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.name}
                className="group p-6 cursor-pointer border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-foreground/60 mt-1">
                      {category.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm font-medium text-primary">
                      {category.count}
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
