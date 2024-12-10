import { useNavigate } from 'react-router-dom';
import { axiosCredential } from '../utils/axiosCredential';
import useAuth from './../hooks/useAuth';
import { useEffect } from 'react';
import useStompClient from '../storage-provider/zustand/useStompClient';
import useUnreadChatCount from '../storage-provider/zustand/useUnreadChatCount';

const AfterLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { connectClient } = useStompClient();
  const { initUnreadChatCounts } = useUnreadChatCount();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        let response = await axiosCredential.post('/api/users/after-login');
        login(response.data);
        connectClient(response.data.userId);

        response = await axiosCredential.get('/api/chatroom/unread-chat');
        initUnreadChatCounts(response.data.unreadCount);

        navigate('/products', { replace: true });
      } catch (_) {
        navigate('/signin', { replace: true });
      }
    };

    getUserInfo();
  }, []);
};

export default AfterLogin;
