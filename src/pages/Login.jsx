import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = { email, password };
      console.log('로그인 시도:', loginData);

      const response = await axios.post('http://localhost:8080/api/login', loginData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      
      console.log('로그인 응답:', response.data);
      alert('로그인 성공!');
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="로그인" />
      <div className="w-full max-w-md mx-auto pt-8 px-4">
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">이메일</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">비밀번호</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors"
            >
              로그인
            </button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition-colors"
          >
            <img 
              src="/api/placeholder/18/18" 
              alt="Google logo" 
              className="w-5 h-5"
            />
            <span className="text-gray-700">Google로 계속하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;