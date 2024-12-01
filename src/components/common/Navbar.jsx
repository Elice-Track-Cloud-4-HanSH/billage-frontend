import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.startsWith('/chat/')) {
    return null;
  }

  return (
    <div className='layout-footer bg-white border-top'>
      <div className='d-flex justify-content-around p-2'>
        <button
          className={`btn btn-link ${location.pathname === '/' ? 'text-primary' : 'text-dark'}`}
          onClick={() => navigate('/')}
        >
          <i className='bi bi-house-door'></i>
          <div className='small'>홈</div>
        </button>
        <button
          className={`btn btn-link ${location.pathname === '/chat' ? 'text-primary' : 'text-dark'}`}
          onClick={() => navigate('/chats')}
        >
          <i className='bi bi-chat'></i>
          <div className='small'>채팅</div>
        </button>
        <button
          className={`btn btn-link ${location.pathname === '/profile' ? 'text-primary' : 'text-dark'}`}
          onClick={() => navigate('/profile')}
        >
          <i className='bi bi-person'></i>
          <div className='small'>마이페이지</div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
