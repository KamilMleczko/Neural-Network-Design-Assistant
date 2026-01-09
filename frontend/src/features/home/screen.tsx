"use client";

import { Button } from "@nndm/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nndm/ui/card";
import { Container } from "@nndm/ui/custom/container";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const HomeScreen = () => {
  return (
    <Container>
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-2xl">
          <div className="absolute -left-4 -top-4 h-72 w-72 animate-blob rounded-full bg-primary/10 blur-3xl filter" />
          <div className="absolute -bottom-4 -right-4 h-72 w-72 animate-blob animation-delay-2000 rounded-full bg-secondary/10 blur-3xl filter" />

          <Card className="relative border-border/50 bg-background/60 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Ready to explore new neural network architecture ideas?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 pb-8">
              <p className="max-w-lg text-center text-muted-foreground">
                Jump right back into the conversation with your AI assistant.
              </p>

              <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="group text-lg">
                  <Link href="/app/chat">
                    Go to Chat
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </Container>
  );
};
