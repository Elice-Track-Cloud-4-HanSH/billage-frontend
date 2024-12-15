import { useNavigate } from 'react-router-dom';
import { axiosCredential } from '../utils/axiosCredential';
import useAuth from './../hooks/useAuth';
import { useEffect } from 'react';
import useStompClient from '../storage-provider/zustand/useStompClient';
import useUnreadChatCount from '../storage-provider/zustand/useUnreadChatCount';
import '@/styles/user/AfterLogin.css';

const AfterLogin = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const { connectClient, disconnectClient } = useStompClient();
  const { initUnreadChatCounts } = useUnreadChatCount();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        let response = await axiosCredential.post('/api/users/after-login');
        if (response.data.userId) {
          login(response.data);
          connectClient(response.data.userId);

          response = await axiosCredential.get('/api/chatroom/unread-chat');
          initUnreadChatCounts(response.data.unreadCount);
        } else {
          logout();
          disconnectClient();
          initUnreadChatCounts(0);
        }
        navigate('/products', { replace: true });
      } catch (_) {
        navigate('/signin', { replace: true });
      }
    };

    getUserInfo();
  }, []);

  return (
    <div className='h-100 d-flex justify-content-center align-items-center after-login-container'>
      <p className='after-login-text'>로그인 중입니다...</p>
    </div>
  );
};

export default AfterLogin;
