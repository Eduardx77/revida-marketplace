'use client';

import Link from 'next/link';
import { Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-bold text-foreground">ReVida</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/marketplace" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Marketplace
          </Link>
          <Link href="#features" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Características
          </Link>
          <Link href="#categories" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Categorías
          </Link>
          <Link href="#about" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Acerca de
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              Iniciar sesión
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Registrarse
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="flex flex-col gap-4 px-4 py-4">
            <Link href="/marketplace" className="text-sm font-medium text-foreground/70 hover:text-foreground">
              Marketplace
            </Link>
            <Link href="#features" className="text-sm font-medium text-foreground/70 hover:text-foreground">
              Características
            </Link>
            <Link href="#categories" className="text-sm font-medium text-foreground/70 hover:text-foreground">
              Categorías
            </Link>
            <Link href="#about" className="text-sm font-medium text-foreground/70 hover:text-foreground">
              Acerca de
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Link href="/auth/login" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/auth/sign-up" className="w-full">
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
