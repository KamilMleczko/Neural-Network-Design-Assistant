"use client";

import { useState } from "react";
import { useAuth } from "@/src/providers/auth-provider";
import { Container } from "@/src/ui/custom/container";
import Link from "next/link";

export const RegisterScreen = () => {
  const { signUp, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const { data, error } = await signUp(email, password, username);

      if (error) {
        setError(error.message);
      } else if (data.user) {
        setMessage("Registration successful! Please check your email for confirmation.");
        // Clear form
        setEmail("");
        setPassword("");
        setUsername("");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
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
          <h2 className="mb-6 text-center font-bold text-2xl text-card-foreground">Welcome!</h2>
          <p className="text-center text-muted-foreground">
            You are signed in as: <span className="text-foreground">{user.email}</span>
          </p>
          <p className="mt-2 text-center text-muted-foreground text-sm">
            User ID: <span className="font-mono text-xs">{user.id}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-md border border-border">
          <h2 className="mb-6 text-center font-bold text-2xl text-card-foreground">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block font-medium text-foreground text-sm">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-ring"
                placeholder="Enter your username"
              />
            </div>

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
                minLength={6}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-ring"
                placeholder="Enter your password (min 6 characters)"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 font-medium text-sm text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Registering..." : "Register"}
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
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
};
