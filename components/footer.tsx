import { Leaf } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-lg font-bold text-foreground">ReVida</span>
            </Link>
            <p className="text-sm text-foreground/60">
              Plataforma ecológica para reutilización y segunda vida de objetos.
            </p>
          </div>

          {/* Links - Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Producto</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Catálogo</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Características</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Precios</Link></li>
            </ul>
          </div>

          {/* Links - Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Acerca de</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Impacto</Link></li>
            </ul>
          </div>

          {/* Links - Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Privacidad</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Términos</Link></li>
              <li><Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition-colors">Contacto</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground/60">
            <p>&copy; 2024 ReVida. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Instagram</Link>
              <Link href="#" className="hover:text-foreground transition-colors">LinkedIn</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
