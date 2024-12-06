import { useContext } from 'react';
import AuthContext from '@/storage-provider/login-info/AuthContext';

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
