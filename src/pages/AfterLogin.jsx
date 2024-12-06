import { useNavigate } from 'react-router-dom';
import { axiosCredential } from '../utils/axiosCredential';
import useAuth from './../hooks/useAuth';
import { useEffect } from 'react';

const AfterLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axiosCredential.post('/api/users/after-login');
        login(response.data);
        navigate('/products', { replace: true });
      } catch (_) {
        navigate('/login', { replace: true });
      }
    };

    getUserInfo();
  }, []);
};

export default AfterLogin;
