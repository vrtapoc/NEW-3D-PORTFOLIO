import { create } from 'zustand';

export const useResponsiveStore = create((set) => ({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,

  // Breakpoints 
  isMobile: window.innerWidth <= 425,         
  isTablet: window.innerWidth > 425 && window.innerWidth <= 768,
  isLaptop: window.innerWidth > 768 && window.innerWidth <= 1600,

  updateDimensions: () =>
    set({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,

      //  Keep logic consistent on resize
      isMobile: window.innerWidth <= 425,
      isTablet: window.innerWidth > 425 && window.innerWidth <= 768,
      isLaptop: window.innerWidth > 768 && window.innerWidth <= 1600,
    }),
}));
