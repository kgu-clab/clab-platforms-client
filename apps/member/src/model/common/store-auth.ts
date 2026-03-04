import { create } from "zustand";

interface AuthState {
  accessToken?: string;
  memberId?: string;
  setAccessToken: (token: string | undefined) => void;
  setMemberId: (memberId: string | undefined) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: undefined,
  memberId: undefined,
  setAccessToken: (accessToken) => set({ accessToken }),
  setMemberId: (memberId) => set({ memberId }),
}));
