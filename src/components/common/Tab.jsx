import PropTypes from 'prop-types';
import { useTab } from '../../hooks/userTab';
import { useEffect } from 'react';

const Tab = ({ tabs, defaultTab, onChangeTab }) => {
  const { activeTab, setActiveTab } = useTab();

  useEffect(() => {
    if (!activeTab && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, activeTab, setActiveTab]);

  const handleTabClick = (value) => {
    setActiveTab(value);
    onChangeTab(value);
  };

  return (
    <div className='d-flex justify-content-start border-bottom'>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={'btn btn-light mx-2 my-3 '}
          onClick={() => handleTabClick(tab.value)}
          style={activeTab === tab.value ? { backgroundColor: '#6366F1', color: 'white' } : {}}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
};

// PropTypes 정의
Tab.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  defaultTab: PropTypes.string,
  onChangeTab: PropTypes.func.isRequired,
};

export default Tab;
