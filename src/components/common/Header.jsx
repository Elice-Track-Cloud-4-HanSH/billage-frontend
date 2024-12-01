import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const Header = ({title}) => {

  const nav = useNavigate();

  return (
    <header className="d-flex align-items-center px-3 py-2 border-bottom">
  
      <button
        className="btn text-dark p-0 me-3"
        onClick={()=>nav(-1)}
        aria-label="뒤로가기"
      >
        {'<'}
      </button>
     
      <h1 className="m-0 fs-4">{title}</h1>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
