import { create } from "zustand"

type NavigationStore = {
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

export const useNavigation = create<NavigationStore>((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
})) 