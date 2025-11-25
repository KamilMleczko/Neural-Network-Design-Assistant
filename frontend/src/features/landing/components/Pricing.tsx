import { Badge } from "@nndm/ui/badge";
import { Button } from "@nndm/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@nndm/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";
import { useIntersectionObserver } from "../hooks/use-intersection-observer";

interface PricingTier {
  name: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline";
  monthlyPrice: string;
  annualPrice?: string;
  priceSubtext?: string;
  annualSavings?: string;
  description?: string;
  features: string[];
  cta: string;
  ctaVariant: "default" | "outline";
  ctaSubtext?: string;
  highlighted?: boolean;
}

interface PricingProps {
  className?: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter Plan",
    badge: "Free Forever",
    badgeVariant: "secondary",
    monthlyPrice: "€0",
    description: "Perfect for getting started",
    features: [
      "Up to 100 queries per month",
      "20 custom papers to process per month",
      "Basic repository analysis",
      "AI-powered answers",
      "Export findings",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline",
  },
  {
    name: "Pro Plan",
    badge: "Most Popular",
    badgeVariant: "default",
    monthlyPrice: "€15",
    annualPrice: "€150",
    annualSavings: "Save €30/year",
    description: "For serious researchers",
    features: [
      "Up to 400 queries per month",
      "50 custom papers to process per month",
      "Deep repository analysis",
      "AI-powered answers",
      "Export and save findings",
      "Priority processing",
      "Advanced search filters",
    ],
    cta: "Start Free Trial",
    ctaVariant: "default",
    ctaSubtext: "14-day free trial, no credit card required",
    highlighted: true,
  },
  {
    name: "Enterprise Plan",
    monthlyPrice: "Custom pricing",
    priceSubtext: "Starting at €30/user/month (minimum 3 seats)",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Unlimited queries (fair use policy)",
      "Unlimited custom articles & repos",
      "Shared project workspaces",
      "Shared article library",
      "Team collaboration tools",
      "Priority support",
      "Custom integrations",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    ctaVariant: "outline",
  },
];

export const Pricing = ({ className }: PricingProps) => {
  const { elementRef, isVisible } = useIntersectionObserver();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [isAnnual, setIsAnnual] = useState(false);

  const handlePricingClick = (tierName: string) => {
    setLoadingStates((prev) => ({ ...prev, [tierName]: true }));
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [tierName]: false }));
    }, 2000);
  };

  const getDisplayPrice = (tier: PricingTier) => {
    if (tier.monthlyPrice === "Custom pricing") return tier.monthlyPrice;
    if (isAnnual && tier.annualPrice) return `${tier.annualPrice}/year`;
    return `${tier.monthlyPrice}/month`;
  };

  return (
    <section id="pricing" className={className}>
      <div className="container mx-auto px-4 py-20 md:py-24">
        <div
          ref={elementRef}
          className={`fade-in-viewport mb-12 text-center ${isVisible ? "visible" : ""}`}
        >
          <h2 className="mb-4 font-bold text-4xl text-foreground md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Choose the plan that fits your needs
          </p>

          {/* Billing Toggle */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setIsAnnual(false)}
              className={`font-medium text-sm transition-colors ${
                !isAnnual ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={!isAnnual}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                isAnnual ? "bg-primary" : "bg-input"
              }`}
              role="switch"
              aria-checked={isAnnual}
              aria-label="Toggle between monthly and annual billing"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-2 font-medium text-sm transition-colors ${
                isAnnual ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={isAnnual}
            >
              Annual
              <Badge variant="default" className="text-xs">
                Save 17%
              </Badge>
            </button>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {pricingTiers.map((tier, index) => {
            const { elementRef: cardRef, isVisible: cardVisible } = useIntersectionObserver();
            return (
              <div
                key={tier.name}
                ref={cardRef}
                className={`fade-in-viewport ${cardVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <Card
                  className={`hover-lift relative flex h-full flex-col transition-all duration-300 ${
                    tier.highlighted
                      ? "border-primary bg-gradient-to-b from-primary/5 to-background shadow-xl hover:shadow-2xl"
                      : "bg-gradient-to-b from-background to-muted/10 hover:border-primary/50"
                  }`}
                  role="article"
                  aria-labelledby={`pricing-${index}-title`}
                >
                  {tier.badge && (
                    <div className="-top-3 -translate-x-1/2 absolute left-1/2 transform">
                      <Badge variant={tier.badgeVariant || "default"} className="shadow-md">
                        {tier.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pt-8 text-center">
                    <CardTitle id={`pricing-${index}-title`} className="mb-2 text-2xl">
                      {tier.name}
                    </CardTitle>
                    {tier.description && (
                      <CardDescription className="text-sm">{tier.description}</CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <div className="mb-6 text-center">
                      <div className="mb-2 font-bold text-4xl text-foreground md:text-5xl">
                        {getDisplayPrice(tier)}
                      </div>
                      {tier.priceSubtext && (
                        <p className="mt-2 text-muted-foreground text-xs">{tier.priceSubtext}</p>
                      )}
                      {isAnnual && tier.annualSavings && (
                        <p className="mt-2 font-medium text-primary text-sm">
                          {tier.annualSavings}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3" role="list">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3" role="listitem">
                          <Check
                            className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span className="text-foreground text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2 pt-6">
                    <Button
                      className={`w-full ${tier.ctaVariant === "default" ? "hover-glow shadow-md" : ""}`}
                      variant={tier.ctaVariant}
                      onClick={() => handlePricingClick(tier.name)}
                      disabled={loadingStates[tier.name]}
                      aria-label={`${tier.cta} for ${tier.name}`}
                    >
                      {loadingStates[tier.name] ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : (
                        tier.cta
                      )}
                    </Button>
                    {tier.ctaSubtext && (
                      <p className="text-center text-muted-foreground text-xs">{tier.ctaSubtext}</p>
                    )}
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
