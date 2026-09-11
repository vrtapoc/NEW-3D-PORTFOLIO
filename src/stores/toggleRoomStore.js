import { create } from 'zustand'

export const useToggleRoomStore = create((set) => ({
    isDarkRoom: true,
    isTransitioning: false,

    setDarkRoom: (booleanValue) => 
        set ({
            isDarkRoom: booleanValue,
        }),
    setIsTransitioning: (booleanValue) => 
    set ({
        isTransitioning: booleanValue,
    }),

}));