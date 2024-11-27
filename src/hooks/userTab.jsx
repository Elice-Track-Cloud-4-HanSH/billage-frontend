import { useContext } from 'react';
import TabContext from './TabContext';

export const useTab = () => useContext(TabContext);
