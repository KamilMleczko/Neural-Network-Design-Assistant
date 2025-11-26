"use client";
import { Container } from "@/src/ui/custom/container";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Pricing } from "./components/Pricing";
import { SeeItInAction } from "./components/SeeItInAction";
import { WhoIsThisFor } from "./components/WhoIsThisFor";
export const LandingScreen = () => {
  return (
    <>
    <Header />
    <Container>

      <Hero />
      <Features />
      <WhoIsThisFor />
      <HowItWorks />
      <SeeItInAction />
      <Pricing />
      <Footer />
    </Container>
    </>
  );
};
