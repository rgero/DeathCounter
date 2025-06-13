import React, { createContext, useContext, useEffect } from "react";
import { getCurrentUser, logout, signInWithGoogle } from "../services/apiAuthentication";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { User } from "@supabase/supabase-js";
import supabase from "../services/supabase";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isFetching: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      queryClient.setQueryData(["authUser"], session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user: data ?? null, isFetching, isLoading, loginWithGoogle: signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthenticationContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
