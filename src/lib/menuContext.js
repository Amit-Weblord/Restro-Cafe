import { createContext, useContext } from 'react';

/** Lets any section open the full-menu overlay: const openMenu = useMenu(); openMenu('mains') */
export const MenuContext = createContext(() => {});
export const useMenu = () => useContext(MenuContext);
