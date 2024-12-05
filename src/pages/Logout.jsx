// src/pages/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/logout', {
            method: 'POST',
            credentials: 'include',
          });
      
          if (response.ok) {
            await response.text(); // 응답 본문을 완전히 읽을 때까지 기다림
            navigate('/login');
          } else {
            console.error('로그아웃 실패');
            navigate('/login');
          }
        } catch (error) {
          console.error('로그아웃 중 오류 발생:', error);
          navigate('/login');
        }
      };

    handleLogout();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return (
    <div className="flex items-center justify-center h-screen">
      <p>로그아웃 중...</p>
    </div>
  );
};

export default Logout;