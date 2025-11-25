import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nndm/ui/card";
import { ArrowRight, FileText, Github, Search } from "lucide-react";
import { useIntersectionObserver } from "../hooks/use-intersection-observer";

interface Step {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
}

interface HowItWorksProps {
  className?: string;
}

const steps: Step[] = [
  {
    step: 1,
    title: "Describe Your ML Problem",
    description:
      "Tell us what you're trying to build - image classification, NLP task, recommendation system, etc.",
    icon: <Search className="h-10 w-10" />,
    iconBg: "bg-primary/10 text-primary",
  },
  {
    step: 2,
    title: "Explore Relevant Research",
    description:
      "Get curated papers ranked by relevance. Ask questions about architectures, datasets, and results",
    icon: <FileText className="h-10 w-10" />,
    iconBg: "bg-accent-foreground/10 text-accent-foreground",
  },
  {
    step: 3,
    title: "Find Working Code",
    description:
      "Access real implementations, see what languages they use, and understand how to adapt them",
    icon: <Github className="h-10 w-10" />,
    iconBg: "bg-secondary/30 text-secondary-foreground",
  },
];

export const HowItWorks = ({ className }: HowItWorksProps) => {
  const { elementRef, isVisible } = useIntersectionObserver();

  return (
    <section id="how-it-works" className={className}>
      <div className="container mx-auto px-4 py-20 md:py-24">
        <div
          ref={elementRef}
          className={`fade-in-viewport mb-16 text-center ${isVisible ? "visible" : ""}`}
        >
          <h2 className="mb-4 font-bold text-4xl text-foreground md:text-5xl">How It Works</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get from problem to implementation in three simple steps
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Desktop: Horizontal Timeline */}
          <div className="hidden gap-8 md:grid md:grid-cols-3">
            {/* Connecting Line */}
            <div
              className="absolute top-16 right-0 left-0 z-0 mx-auto h-0.5 bg-border"
              style={{ width: "calc(100% - 8rem)" }}
              aria-hidden="true"
            />

            {steps.map((step, index) => {
              const { elementRef: stepRef, isVisible: stepVisible } = useIntersectionObserver();
              return (
                <div
                  key={step.step}
                  ref={stepRef}
                  className={`fade-in-viewport relative ${stepVisible ? "visible" : ""}`}
                  style={{ transitionDelay: `${index * 0.15}s` }}
                >
                  {/* Arrow Between Steps */}
                  {index < steps.length - 1 && (
                    <ArrowRight
                      className="-right-8 -translate-y-1/2 absolute top-16 z-10 h-6 w-6 transform text-primary"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  )}

                  <Card
                    className="hover-lift relative h-full border-border transition-all duration-300 hover:border-primary/50"
                    role="article"
                    aria-labelledby={`step-${index}-title`}
                    tabIndex={0}
                  >
                    {/* Step Number Badge */}
                    <div className="-top-3 absolute left-6 z-30" aria-label={`Step ${step.step}`}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm shadow-md">
                        {step.step}
                      </div>
                    </div>

                    {/* Icon Container */}
                    <div
                      className="-translate-x-1/2 -translate-y-1/2 absolute top-12 left-1/2 z-20 transform"
                      aria-hidden="true"
                    >
                      <div
                        className={`h-16 w-16 rounded-2xl ${step.iconBg} flex items-center justify-center border-4 border-background shadow-lg`}
                      >
                        {step.icon}
                      </div>
                    </div>

                    <CardHeader className="pt-16 pb-4">
                      <CardTitle id={`step-${index}-title`} className="text-center text-xl">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-6">
                      <CardDescription className="text-center text-base leading-relaxed">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Mobile: Vertical Timeline */}
          <div className="space-y-8 md:hidden">
            {steps.map((step, index) => {
              const { elementRef: stepRef, isVisible: stepVisible } = useIntersectionObserver();
              return (
                <div
                  key={step.step}
                  ref={stepRef}
                  className={`fade-in-viewport relative ${stepVisible ? "visible" : ""}`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div
                      className="-mb-8 absolute top-20 bottom-0 left-8 w-0.5 bg-border"
                      aria-hidden="true"
                    />
                  )}

                  <Card
                    className="relative border-border transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
                    role="article"
                    aria-labelledby={`step-mobile-${index}-title`}
                  >
                    {/* Step Number Badge */}
                    <div className="-top-3 absolute left-6 z-10" aria-label={`Step ${step.step}`}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm shadow-md">
                        {step.step}
                      </div>
                    </div>

                    {/* Icon Container */}
                    <div
                      className="-translate-x-1/2 -translate-y-1/2 absolute top-12 left-8 z-10 transform"
                      aria-hidden="true"
                    >
                      <div
                        className={`h-12 w-12 rounded-xl ${step.iconBg} flex items-center justify-center border-4 border-background shadow-lg`}
                      >
                        <div className="scale-75">{step.icon}</div>
                      </div>
                    </div>

                    <CardHeader className="pt-12 pb-4 pl-12">
                      <CardTitle id={`step-mobile-${index}-title`} className="text-lg">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-6 pl-12">
                      <CardDescription className="text-base leading-relaxed">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
