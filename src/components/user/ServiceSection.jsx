import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ServiceSection = ({ subject, options }) => {
  const nav = useNavigate();

  return (
    <div className='mt-4 px-5'>
      <h5 className='mb-3'>{subject}</h5>
      {options.map((option) => (
        <div
          key={option.nav}
          className='d-flex justify-content-between align-items-center py-2 border-bottom'
        >
          <div>{option.name}</div>
          <div
            className='text-primary cursor-pointer'
            onClick={() => nav(option.nav)}
            style={{ cursor: 'pointer' }}
          >
            {'>'}
          </div>
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
