"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/src/providers/auth-provider";
import { Container } from "@/src/ui/custom/container";

export const LoginScreen = () => {
  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        setError(error.message);
      } else if (data.user) {
        setMessage("Login successful! Redirecting...");
        // Clear form
        setEmail("");
        setPassword("");

        // Redirect after successful login (optional)
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div>Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-md border border-border">
          <h2 className="mb-6 text-center font-bold text-2xl text-card-foreground">
            Welcome Back!
          </h2>
          <p className="mb-4 text-center text-muted-foreground">
            You are already signed in as: <br />
            <span className="font-medium text-foreground">{user.email}</span>
          </p>
          <p className="mb-6 text-center text-muted-foreground text-sm">
            User ID: <span className="font-mono text-xs">{user.id}</span>
          </p>
          <div className="text-center">
            <Link href="/" className="font-medium text-primary hover:text-primary/80">
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-md border border-border">
          <h2 className="mb-6 text-center font-bold text-2xl text-card-foreground">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block font-medium text-foreground text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-ring"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-medium text-foreground text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-ring"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 font-medium text-sm text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {message && (
            <div className="mt-4 rounded border border-green-400/50 bg-green-100/10 p-3 text-green-600 dark:text-green-400">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded border border-destructive/50 bg-destructive/10 p-3 text-destructive">
              {error}
            </div>
          )}

          <p className="mt-4 text-center text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary/80">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
};
