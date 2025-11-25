"use client";

import { useState } from "react";
import { useAuth } from "@/src/providers/auth-provider";
import { Container } from "@/src/ui/custom/container";

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
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-center font-bold text-2xl">Welcome!</h2>
          <p className="text-center text-gray-600">You are signed in as: {user.email}</p>
          <p className="mt-2 text-center text-gray-500 text-sm">User ID: {user.id}</p>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-center font-bold text-2xl">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block font-medium text-gray-700 text-sm">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-medium text-gray-700 text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-medium text-gray-700 text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Enter your password (min 6 characters)"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>

          {message && (
            <div className="mt-4 rounded border border-green-400 bg-green-100 p-3 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}

          <p className="mt-4 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </Container>
  );
};
