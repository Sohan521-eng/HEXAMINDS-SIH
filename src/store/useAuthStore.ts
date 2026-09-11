import { create } from "zustand";
import { UserRole, UserSession } from "@/types";

interface AuthStoreState {
  user: UserSession | null;
  role: UserRole;
  isAuthenticated: boolean;
  setUser: (user: UserSession | null) => void;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  role: "public",
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user, role: user?.role || "public" }),
  setRole: (role) => set({ role }),
  logout: () => set({ user: null, isAuthenticated: false, role: "public" }),
}));
