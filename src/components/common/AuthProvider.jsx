import { useState } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const login = (userData) => {
    console.log('before rendering - isLoggedIn : ', isLoggedIn);
    setIsLoggedIn(true);
    setUserInfo(userData);
    console.log(userData);
  };
  const logout = () => {
    console.log('before rendering - isLoggedIn : ', isLoggedIn);
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
