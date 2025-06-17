import { create } from "zustand";

type settingsStore = {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

export const useSettings = create<settingsStore>((set) => ({
    isOpen: false,
    onClose: () => set({ isOpen : false}),
    onOpen: () => set({ isOpen : true})
}))