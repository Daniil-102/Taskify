import { create } from 'zustand'


type CardModalStore = {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
}

export const useProModal = create<CardModalStore>(set => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))