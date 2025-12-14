import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/auth/actions';

// Global Components
import { Background } from '@/components/landing/Background';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

// Page Sections
import { Hero } from '@/components/landing/sections/Hero';
import { About } from '@/components/landing/sections/About';
import { VisionValues } from '@/components/landing/sections/VisionValues';
import { Services } from '@/components/landing/sections/Services';
import { WhyUs } from '@/components/landing/sections/WhyUs';
import { Team } from '@/components/landing/sections/Team';
import { Testimonials } from '@/components/landing/sections/Testimonials';

async function handleSignOut() {
  'use server';
  await signOut();
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-black text-foreground overflow-x-hidden selection:bg-emerald-500/30 selection:text-white font-sans relative">
      
      <Background />

      <Navbar user={user} signOutAction={handleSignOut} />

      <main className="pb-20 relative z-10 text-center md:text-right">
        <Hero />
        <VisionValues />
        <Services />
        <WhyUs />
        <About />
        <Team />
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
}
