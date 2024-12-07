import { useState, useEffect } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const decodedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo(decodedUserInfo);
    }
  }, []);

  const login = (userData) => {
    setUserInfo(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };
  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
