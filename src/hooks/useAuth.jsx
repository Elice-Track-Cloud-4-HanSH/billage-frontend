import { useContext } from 'react';
import AuthContext from '../components/common/AuthContext';

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
