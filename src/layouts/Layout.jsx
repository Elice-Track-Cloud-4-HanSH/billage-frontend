import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar.jsx';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='layout-container'>
      <div className='layout-wrapper'>
        {/* Header Section */}

        {/* Content Area */}
        <div className='layout-content'>
          <Outlet />
        </div>

        {/* Bottom Navigation */}
        <Navbar />
      </div>
    </div>
  );
};

export default Layout;
