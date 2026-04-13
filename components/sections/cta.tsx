import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          </div>

          <div className="relative px-6 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-balance">
                ¿Listo para Comenzar?
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-pretty">
                Únete a miles de personas que ya están haciendo la diferencia. Intercambia, dona y sé parte del cambio hacia una economía más circular.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 font-medium group"
              >
                Crear Cuenta
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-background"
              >
                Ver Oferta Actual
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 border-t border-primary/20">
              <p className="text-sm text-foreground/60 mb-4">Verificado y confiable por</p>
              <div className="flex justify-center items-center gap-8 flex-wrap">
                <div className="text-xs font-medium text-foreground/50">100% Seguro</div>
                <div className="text-xs font-medium text-foreground/50">Comunidad Verificada</div>
                <div className="text-xs font-medium text-foreground/50">Eco-Friendly</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
