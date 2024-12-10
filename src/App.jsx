import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Easteregg from '@/pages/Easteregg.jsx';
import ChatroomList from '@/pages/ChatroomList.jsx';
import ChatPage from '@/pages/ChatPage';
import '@/styles/global.css';
import Layout from '@/layouts/Layout.jsx';
import MyReview from '@/pages/review/MyReview';
import MySales from '@/pages/rental-record/MySales';
import MyPurchase from '@/pages/rental-record/MyPurchase';
import { ProductRegister, ProductEdit } from '@/pages/product/ProductUpsert.jsx';
import WriteProductReview from '@/pages/review/WriteProductReview';
import WriteUserReview from '@/pages/review/WriteUserReview.jsx';
import Login from '@/pages/Login.jsx';
import Signup from '@/pages/Signup.jsx';
import ProductDetail from '@/pages/product/ProductDetail';
import Logout from '@/pages/Logout.jsx';
import EditProfile from '@/pages/EditProfile.jsx';
import SetToRented from '@/pages/rental-record/SetToRented';
import ProductList from '@/pages/product/ProductList';
import TargetProfile from './pages/TargetProfile';
import ForgotPassword from '@/pages/user/ForgotPassword';
import FavoriteProductList from '@/pages/product/FavoriteProductList';
import MapTest from '@/pages/map/Activity_area';
import ChatroomListProvider from './storage-provider/chatroom-list/ChatroomListProvider';
import useAuth from '@/hooks/useAuth';
import MyPage from './pages/MyPage';
import AfterLogin from './pages/AfterLogin';

const App = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = () => {
      logout();
    };

    window.addEventListener('Unauthorized', handleLogout);

    return () => {
      window.removeEventListener('Unauthorized', handleLogout);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/after-login' element={<AfterLogin />} />
          {/* 채팅 */}
          <Route path='/easter-egg' element={<Easteregg />} />
          <Route
            path='/chats'
            element={
              <ChatroomListProvider>
                <ChatroomList />
              </ChatroomListProvider>
            }
          />
          <Route path='/chat' element={<ChatPage />} />
          {/* 리뷰, 대여기록 */}
          <Route path='/myreview' element={<MyReview />} />
          <Route path='/mysales' element={<MySales />} />
          <Route path='/mypurchase' element={<MyPurchase />} />
          <Route path='/product-review/:id' element={<WriteProductReview />} />
          <Route path='/user-review/:id' element={<WriteUserReview />} />
          <Route path='/set-to-rented/:id' element={<SetToRented />} />
          {/* 회원 */}
          <Route path='/signin' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/profile/:id' element={<TargetProfile />} />
          <Route path='/mypage' element={<MyPage />} />
          {/* 상품 */}
          <Route path='/products/register' element={<ProductRegister />} />
          <Route path='/products/:productId/edit' element={<ProductEdit />} />
          <Route path='/products/:productId' element={<ProductDetail />} />
          <Route path='/products' element={<ProductList />} />
          <Route path='/myfavorites' element={<FavoriteProductList />} />
          {/* 지도 */}
          <Route path='/map' element={<MapTest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
