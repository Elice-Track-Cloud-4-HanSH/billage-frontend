import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const TabContext = createContext({
  activeTab: '',
  setActiveTab: () => {},
});

export const TabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('');
  return <TabContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabContext.Provider>;
};

TabProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TabContext;
