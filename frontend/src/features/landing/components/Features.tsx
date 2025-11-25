import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nndm/ui/card";
import { BookOpen, Database, FileSearch, Github, Network, Sparkles } from "lucide-react";
import { useIntersectionObserver } from "../hooks/use-intersection-observer";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeaturesProps {
  className?: string;
}

const features: Feature[] = [
  {
    title: "Smart Paper Discovery",
    description:
      "Ask about your ML problem and get the most relevant research papers ranked by relevance",
    icon: <Sparkles className="h-8 w-8 text-primary" />,
  },
  {
    title: "Deep Paper Analysis",
    description:
      "Ask questions about any paper: What datasets? What architecture? What were the results?",
    icon: <FileSearch className="h-8 w-8 text-primary" />,
  },
  {
    title: "Repository Finder",
    description:
      "Get links to GitHub repos implementing the papers, with analysis of what they do and what tools they leverage",
    icon: <Github className="h-8 w-8 text-primary" />,
  },
  {
    title: "Architecture Breakdown",
    description:
      "Understand complex network architectures with AI-powered explanations tailored to your level",
    icon: <Network className="h-8 w-8 text-primary" />,
  },
  {
    title: "Dataset Recommendations",
    description:
      "Discover which datasets were used in successful implementations of similar problems",
    icon: <Database className="h-8 w-8 text-primary" />,
  },
  {
    title: "Implementation Guide",
    description: "Get step-by-step guidance on adapting research to your specific use case",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
  },
];

export const Features = ({ className }: FeaturesProps) => {
  const { elementRef, isVisible } = useIntersectionObserver();

  return (
    <section id="features" className={className}>
      <div className="container mx-auto px-4 py-20 md:py-24">
        <div
          ref={elementRef}
          className={`fade-in-viewport mb-16 text-center ${isVisible ? "visible" : ""}`}
        >
          <h2 className="mb-4 font-bold text-4xl text-foreground md:text-5xl">Powerful Features</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to discover, understand, and implement neural network architectures
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {features.map((feature, index) => {
            const { elementRef: cardRef, isVisible: cardVisible } = useIntersectionObserver();
            return (
              <div
                key={feature.title}
                ref={cardRef}
                className={`fade-in-viewport ${cardVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <Card
                  className="group hover-lift h-full transition-all duration-300 hover:border-primary/50"
                  role="article"
                  aria-labelledby={`feature-${index}-title`}
                  tabIndex={0}
                >
                  <CardHeader>
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20"
                      aria-hidden="true"
                    >
                      {feature.icon}
                    </div>
                    <CardTitle id={`feature-${index}-title`} className="text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
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
