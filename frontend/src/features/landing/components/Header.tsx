import vLogo from "@nndm/assets/v-logo.svg";
import veilleLogo from "@nndm/assets/veille-logo.svg";
import { Button } from "@nndm/ui/button";
import { ThemeToggle } from "@nndm/ui/custom/theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@nndm/ui/sheet";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur transition-shadow supports-[backdrop-filter]:bg-background/60 ${
        isScrolled ? "shadow-md" : ""
      } ${className}`}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          {/* Mobile: V logo */}
          <img src={vLogo.src} alt="Veille" className="h-8 w-auto md:hidden" />
          {/* Desktop: Full Veille logo */}
          <img src={veilleLogo.src} alt="Veille" className="hidden h-12 w-auto md:block" />
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => scrollToSection("features")}
            className="text-foreground transition-colors hover:text-primary"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-foreground transition-colors hover:text-primary"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-foreground transition-colors hover:text-primary"
          >
            How It Works
          </button>
          <ThemeToggle />
          <Button variant="default">
            <Link href="/app"> Start Free Trial</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center">
                  <img src={veilleLogo} alt="Veille" className="h-8 w-auto" />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-6">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left text-foreground text-lg transition-colors hover:text-primary"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-left text-foreground text-lg transition-colors hover:text-primary"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-left text-foreground text-lg transition-colors hover:text-primary"
                >
                  How It Works
                </button>

                <Button variant="default" className="mt-4 w-full">
                  <Link href="/app" replace>
                    {" "}
                    Start Free Trial{" "}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};
