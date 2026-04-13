import { Button } from '@/components/ui/button';
import { Leaf, Recycle } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/30 via-background to-background" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-lg bg-accent/50 px-3 py-1 text-sm font-medium text-foreground/70">
                <Recycle className="h-4 w-4" />
                Economía Circular Comunitaria
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
                Dale Segunda Vida a tus Objetos
              </h1>
              <p className="text-lg text-foreground/70 leading-relaxed text-pretty">
                En ReVida creemos que cada objeto tiene potencial. Intercambia, dona y reutiliza con tu comunidad. Reduce desperdicio, apoya el medio ambiente y construye conexiones significativas.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 font-medium">
                Explorar Catálogo
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary/30 hover:bg-accent/30"
              >
                Saber Más
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div>
                <div className="text-2xl font-bold text-primary">2.5K+</div>
                <p className="text-sm text-foreground/60">Objetos Activos</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">1.2K+</div>
                <p className="text-sm text-foreground/60">Usuarios</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">850+</div>
                <p className="text-sm text-foreground/60">Intercambios</p>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative h-96 sm:h-full lg:h-96 flex items-center justify-center">
            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/10 via-accent/10 to-transparent rounded-3xl" />
            
            <div className="space-y-4 w-full">
              {/* Featured Items Preview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 rounded-xl bg-accent/30 border border-accent/50 flex items-center justify-center">
                  <Leaf className="h-12 w-12 text-primary/30" />
                </div>
                <div className="h-32 rounded-xl bg-accent/30 border border-accent/50 flex items-center justify-center">
                  <Recycle className="h-12 w-12 text-primary/30" />
                </div>
              </div>
              <div className="h-32 rounded-xl bg-accent/30 border border-accent/50 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Muebles, Libros, Ropa...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
