import heroImage from "@nndm/assets/hero-neural-network.jpg";
import veilleLogo from "@nndm/assets/veille-logo.svg";
import { Button } from "@nndm/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface HeroProps {
  className?: string;
}

export const Hero = ({ className }: HeroProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const scrollToDemo = () => {
    const demoSection = document.getElementById("how-it-works");
    demoSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartTrial = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <section className={className} role="banner">
      <div className="relative overflow-hidden">
        {/* Animated Neural Network Background */}
        <div className="-z-10 absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="neural-network-bg" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 lg:py-40">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="animate-fade-in space-y-8">
              <div className="space-y-6">
                <h1 className="font-bold text-4xl text-foreground leading-tight md:text-5xl lg:text-6xl">
                  Find the Perfect Neural Network Architecture for Your ML Problem
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
                  Search thousands of research papers, understand architectures, find working
                  implementations, and get AI-powered answers about datasets, repos, and
                  methodologies
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="group hover-glow px-8 text-lg shadow-md"
                  onClick={handleStartTrial}
                  disabled={isLoading}
                  aria-label="Start your free trial"
                >
                  <Link href="/app">Start Free Trial</Link>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="group px-8 text-lg shadow-sm transition-shadow hover:shadow-md"
                  onClick={scrollToDemo}
                  aria-label="See how Veille works"
                >
                  <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  See How It Works
                </Button>
              </div>

              {/* Trust Indicators */}
              <div
                className="flex flex-wrap items-center gap-6 pt-6 text-muted-foreground text-sm"
                role="list"
              >
                <div className="flex items-center gap-2" role="listitem">
                  <div
                    className="h-2 w-2 animate-pulse rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>1000+ Research Papers</span>
                </div>
                <div className="flex items-center gap-2" role="listitem">
                  <div
                    className="h-2 w-2 animate-pulse rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>AI-Powered Search</span>
                </div>
                <div className="flex items-center gap-2" role="listitem">
                  <div
                    className="h-2 w-2 animate-pulse rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>Implementation Ready</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="hover-lift relative overflow-hidden rounded-2xl border border-border shadow-2xl">
                <img
                  src={heroImage.src}
                  alt="Neural Network Design Assistant Interface showing architecture visualization with interactive components"
                  className="h-auto w-full"
                  loading="eager"
                />
                {/* Veille Logo Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img
                    src={veilleLogo.src}
                    alt="Veille Logo"
                    className="h-auto w-48 drop-shadow-2xl md:w-64 lg:w-80"
                  />
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-50" />
              </div>
              {/* Floating Elements */}
              <div className="-top-4 -right-4 absolute h-24 w-24 animate-pulse rounded-full bg-primary/20 blur-3xl" />
              <div
                className="-bottom-4 -left-4 absolute h-32 w-32 animate-pulse rounded-full bg-accent/30 blur-3xl"
                style={{ animationDelay: "1s" }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .neural-network-bg {
          position: absolute;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, hsl(var(--accent-foreground) / 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, hsl(var(--primary) / 0.05) 0%, transparent 50%);
          animation: neural-pulse 20s ease-in-out infinite;
        }

        @keyframes neural-pulse {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-10px, -10px) scale(1.05);
            opacity: 0.8;
          }
        }

        .hover-scale {
          transition: transform 0.3s ease;
        }

        .hover-scale:hover {
          transform: scale(1.02);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};
