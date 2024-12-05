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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          {/* 채팅 */}
          <Route path='/easter-egg' element={<Easteregg />} />
          <Route path='/chats' element={<ChatroomList />} />
          <Route path='/chat' element={<ChatPage />} />
          {/* 리뷰, 대여기록 */}
          <Route path='/myreview' element={<MyReview />} />
          <Route path='/mysales' element={<MySales />} />
          <Route path='/mypurchase' element={<MyPurchase />} />
          <Route path='/product-review/:id' element={<WriteProductReview />} />
          <Route path='/user-review/:id' element={<WriteUserReview />} />
          <Route path='/set-to-rented/:id' element={<SetToRented />} />
          {/* 회원 */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/profile/:id' element={<TargetProfile />} />
          {/* 상품 */}
          <Route path='/products/register' element={<ProductRegister />} /> {/* 상품 등록 페이지 */}
          <Route path='/products/:productId/edit' element={<ProductEdit />} />{/* 상품 수정 페이지 */}
          <Route path='/products' element={<ProductList />} /> {/* 상품 목록 페이지 */}
          <Route path='/myfavorites' element={<FavoriteProductList />} /> {/* 관심 상품 목록 페이지 */}
        </Route>
        <Route path='/products/:productId' element={<ProductDetail />} /> {/* 상품 상세 페이지 */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
