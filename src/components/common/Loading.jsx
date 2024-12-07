import { PropTypes } from 'prop-types';

const Loading = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <div
          className='d-flex position-absolute w-100 h-100 z-1000 bg-secondary bg-opacity-75 align-items-center justify-content-center'
          style={{ right: '0px' }}
        >
          <div className='display-6'>Loading</div>
        </div>
      )}
    </>
  );
};
Loading.propTypes = {
  isLoading: PropTypes.bool,
};

export default Loading;
