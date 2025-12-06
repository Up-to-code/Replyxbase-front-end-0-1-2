import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserProfile } from "@/app/actions/user";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt?: Date;
  credits?: number;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadUser: () => Promise<void>;
  updateProfile: (data: { name?: string; image?: string }) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      loadUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await getUserProfile();
          set({ user: { ...user, image: user.image ?? null }, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to load user";
          set({ error: errorMessage, isLoading: false });
          console.error("Failed to load user:", error);
        }
      },

      updateProfile: async (data: { name?: string; image?: string }) => {
        set({ isLoading: true, error: null });
        try {
          // Update via Better Auth if available, otherwise just update local state
          const { user } = get();
          if (!user) {
            throw new Error("No user found");
          }

          // Update local state immediately for optimistic UI
          const updatedUser = {
            ...user,
            ...(data.name && { name: data.name }),
            ...(data.image && { image: data.image }),
          };
          set({ user: updatedUser, isLoading: false });
          
          // Note: Actual profile update should be done via server actions
          // This is just for local state management
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
          set({ error: errorMessage, isLoading: false });
          console.error("Failed to update profile:", error);
          return false;
        }
      },

      refresh: async () => {
        await get().loadUser();
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

