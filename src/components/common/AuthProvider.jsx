import { useState, useEffect } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const login = (userData) => {
    setUserInfo(userData);
    sessionStorage.setItem('userInfo', JSON.stringify(userData));
  };
  const logout = () => {
    setUserInfo(null);
    sessionStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
