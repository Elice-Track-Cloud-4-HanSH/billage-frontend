import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ServiceSection = ({ subject, options }) => {
  const nav = useNavigate();

  return (
    <div>
      <h5>{subject}</h5>
      {options.map((option) => (
        <div key={option.nav} className='d-flex justify-content-between'>
          <div>{option.name}</div>
          <div onClick={() => nav(option.nav)}>{'>'}</div>
        </div>
      ))}
    </div>
  );
};

ServiceSection.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      nav: PropTypes.string.isRequired,
    })
  ).isRequired,
  subject: PropTypes.string,
};

export default ServiceSection;
