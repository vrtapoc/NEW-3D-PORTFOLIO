import { create } from 'zustand'

export const useUiStore = create((set) => ({
    isPanelOpen: false,

    openPanel:() => 
        set ({
            isPanelOpen: true,
        }),

    closePanel:() => 
        set ({
            isPanelOpen: false,
        }),
}));