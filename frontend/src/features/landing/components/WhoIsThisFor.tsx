import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nndm/ui/card";
import { GraduationCap, Rocket } from "lucide-react";
import { useIntersectionObserver } from "../hooks/use-intersection-observer";

interface Persona {
  title: string;
  headline: string;
  benefits: string;
  icon: React.ReactNode;
  iconBg: string;
}

interface WhoIsThisForProps {
  className?: string;
}

const personas: Persona[] = [
  {
    title: "For Experienced ML Engineers",
    headline: "Accelerate Your Research",
    benefits:
      "Skip hours of paper hunting. Get instant access to implementation details, compare architectures, find production-ready code repositories",
    icon: <Rocket className="h-8 w-8" />,
    iconBg: "bg-primary/10 text-primary",
  },
  {
    title: "For ML Beginners",
    headline: "Learn From the Best",
    benefits:
      "Get guided explanations of complex papers, understand what datasets work for similar problems, see real-world examples with code you can learn from",
    icon: <GraduationCap className="h-8 w-8" />,
    iconBg: "bg-accent-foreground/10 text-accent-foreground",
  },
];

export const WhoIsThisFor = ({ className }: WhoIsThisForProps) => {
  const { elementRef, isVisible } = useIntersectionObserver();

  return (
    <section className={className}>
      <div className="container mx-auto px-4 py-20 md:py-24">
        <div
          ref={elementRef}
          className={`fade-in-viewport mb-16 text-center ${isVisible ? "visible" : ""}`}
        >
          <h2 className="mb-4 font-bold text-4xl text-foreground md:text-5xl">Who Is This For?</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Whether you're just starting your ML journey or you're a seasoned researcher, we help
            you find the right neural network architecture faster.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {personas.map((persona, index) => {
            const { elementRef: cardRef, isVisible: cardVisible } = useIntersectionObserver();
            return (
              <div
                key={persona.title}
                ref={cardRef}
                className={`fade-in-viewport ${cardVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <Card
                  className="group hover-lift h-full transition-all duration-300 hover:border-primary/50"
                  role="article"
                  aria-labelledby={`persona-${index}-title`}
                  tabIndex={0}
                >
                  <CardHeader className="space-y-4">
                    <div
                      className={`h-16 w-16 rounded-2xl ${persona.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                      aria-hidden="true"
                    >
                      {persona.icon}
                    </div>
                    <div>
                      <p className="mb-2 font-medium text-primary text-sm">{persona.title}</p>
                      <CardTitle id={`persona-${index}-title`} className="text-2xl">
                        {persona.headline}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {persona.benefits}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
