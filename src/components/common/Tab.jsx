import { useState } from 'react';
import PropTypes from 'prop-types';

const Tab = ({ tabs, defaultTab, onChangeTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].value);

  const handleTabClick = (value) => {
    setActiveTab(value);
    onChangeTab(value);
  };

  return (
    <div className='d-flex justify-content-start border-bottom'>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`btn ${activeTab === tab.value ? 'btn-primary' : 'btn-light'} mx-2`}
          onClick={() => handleTabClick(tab.value)}
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
