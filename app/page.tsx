import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { Categories } from '@/components/sections/categories';
import { CTA } from '@/components/sections/cta';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Categories />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
