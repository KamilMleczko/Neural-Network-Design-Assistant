"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/client";
import { createClient } from "../utils/supabase/client";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingUsername, setPendingUsername] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // When user confirms email, create user in our database
      if (event === "SIGNED_IN" && session?.user && pendingUsername) {
        const _userResponse = await authApi.createUser(
          { username: pendingUsername },
          session.access_token,
        );
        setPendingUsername(null); // Clear after successful creation
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, pendingUsername]);

  const signUp = async (email: string, password: string, username: string) => {
    // Check if user is already signed in before attempting signup

    try {
      // First, check if email already exists in our database
      const emailCheckResponse = (await authApi.checkEmail(email)) as { exists: boolean };

      if (emailCheckResponse.exists) {
        return {
          data: null,
          error: {
            message: "An account with this email already exists. Please try logging in instead.",
          },
        };
      }
    } catch (_error) {
      // If the API call fails, we should not proceed with signup
      // This prevents creating orphaned Supabase accounts when our backend is down
      return {
        data: null,
        error: { message: "Unable to verify email availability. Please try again later." },
      };
    }

    // Check current session from Supabase
    const { data: currentSession } = await supabase.auth.getSession();

    if (currentSession.session?.user) {
      if (currentSession.session.user.email === email) {
        return {
          data: null,
          error: { message: "You are already signed in with this email address." },
        };
      } else {
        return {
          data: null,
          error: {
            message:
              "You are already signed in. Please sign out first before creating a new account.",
          },
        };
      }
    }

    // Store username to use later when user confirms email
    setPendingUsername(username);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
