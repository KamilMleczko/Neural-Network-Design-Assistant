import { Button } from "@nndm/ui/button";
import { Input } from "@nndm/ui/input";
import { Github, Linkedin, MessageSquare, Twitter } from "lucide-react";
import { useState } from "react";

interface FooterProps {
  className?: string;
}

export const Footer = ({ className }: FooterProps) => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribing(true);
      setTimeout(() => {
        setIsSubscribing(false);
        setEmail("");
      }, 2000);
    }
  };

  return (
    <footer className={className} role="contentinfo">
      <div className="container mx-auto border-border border-t px-4 py-12 md:py-16">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
          <nav aria-label="Product links">
            <h4 className="mb-4 font-semibold text-foreground">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground transition-colors hover:text-primary focus:text-primary"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-muted-foreground transition-colors hover:text-primary focus:text-primary"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary focus:text-primary"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </nav>
          <nav aria-label="Company links">
            <h4 className="mb-4 font-semibold text-foreground">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary focus:text-primary"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary focus:text-primary"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary focus:text-primary"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          <nav aria-label="Legal links">
            <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary focus:text-primary"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary focus:text-primary"
                >
                  Terms
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Newsletter</h4>
            <p className="mb-4 text-muted-foreground text-sm">Get ML research tips</p>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubscribe();
              }}
              aria-label="Newsletter subscription"
            >
              <Input
                type="email"
                placeholder="Your email"
                className="text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <Button
                variant="default"
                size="sm"
                type="submit"
                disabled={isSubscribing || !email}
                className="hover-glow"
              >
                {isSubscribing ? "..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-border border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Veille. All rights reserved.
          </p>
          <nav aria-label="Social media links">
            <div className="flex gap-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transform text-muted-foreground transition-colors duration-200 hover:scale-110 hover:text-primary"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transform text-muted-foreground transition-colors duration-200 hover:scale-110 hover:text-primary"
                aria-label="Connect with us on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transform text-muted-foreground transition-colors duration-200 hover:scale-110 hover:text-primary"
                aria-label="View our GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://reddit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transform text-muted-foreground transition-colors duration-200 hover:scale-110 hover:text-primary"
                aria-label="Join our Reddit community"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
};
