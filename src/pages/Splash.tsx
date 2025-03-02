
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, HandHeart, Users } from 'lucide-react';
import ThreeBackground from '@/components/ThreeBackground';

const Splash: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white relative overflow-hidden">
      {/* Three.js Background */}
      <ThreeBackground />
      
      {/* Hero section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden py-20 text-white">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-campaign-navy via-campaign-navy-light to-campaign-navy-dark opacity-90"></div>
        
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-in-up mb-4 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              VOTE<span className="text-campaign-orange">Tech</span>
            </h1>
            <p className="animate-fade-in-up animation-delay-200 mb-8 text-lg md:text-xl lg:text-2xl text-white/85">
              Transforming political engagement through innovative technology
            </p>
            <div className="animate-fade-in-up animation-delay-300 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-campaign-orange hover:bg-campaign-orange-dark">
                <Link to="/dashboard">
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                <Link to="/">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="animate-fade-in-up group rounded-xl p-8 text-center transition-all duration-300">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-campaign-orange/10 text-campaign-orange transition-transform duration-300 group-hover:scale-110">
                <Code className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Powerful Platform</h3>
              <p className="text-muted-foreground">
                Built with the latest technologies to ensure reliability, security, and performance.
              </p>
            </div>
            
            <div className="animate-fade-in-up animation-delay-200 group rounded-xl p-8 text-center transition-all duration-300">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-campaign-orange/10 text-campaign-orange transition-transform duration-300 group-hover:scale-110">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">User-Centric</h3>
              <p className="text-muted-foreground">
                Designed with users in mind, making voter engagement accessible and intuitive.
              </p>
            </div>
            
            <div className="animate-fade-in-up animation-delay-400 group rounded-xl p-8 text-center transition-all duration-300">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-campaign-orange/10 text-campaign-orange transition-transform duration-300 group-hover:scale-110">
                <HandHeart className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Social Impact</h3>
              <p className="text-muted-foreground">
                Making a difference in communities by increasing voter participation and awareness.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto border-t bg-white py-8">
        <div className="container">
          <div className="text-center">
            <p className="font-bold text-campaign-navy">
              VOTE<span className="text-campaign-orange">Tech</span> © 2024
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Empowering democratic engagement through technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Splash;
