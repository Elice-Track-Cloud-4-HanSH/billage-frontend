import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Easteregg from '@/pages/Easteregg.jsx';
import ChatroomList from '@/pages/ChatroomList.jsx';
import ChatPage from '@/pages/ChatPage';
import '@/styles/global.css';
import Layout from '@/layouts/Layout.jsx';
import MyReview from '@/pages/MyReview';
import MySales from './pages/MySales';
import MyPurchase from './pages/MyPurchase';
import {ProductRegister, ProductEdit} from '@/pages/product/ProductUpsert.jsx';
import WriteProductReview from './pages/WriteProductReview';
import WriteUserReview from './pages/WriteUserReview.jsx';
import Login from '@/pages/Login.jsx';
import Signup from '@/pages/Signup.jsx';
import ProductDetail from '@/pages/product/ProductDetail';
import Logout from '@/pages/Logout.jsx';
import ProfileEdit from '@/pages/ProfileEdit.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/easter-egg' element={<Easteregg />} />
          <Route path='/chat' element={<ChatroomList />} />
          <Route path='/chat/:chatroomId' element={<ChatPage />} />
          <Route path='/myreview' element={<MyReview />} />
          <Route path='/mysales' element={<MySales />} />
          <Route path='/mypurchase' element={<MyPurchase />} />
          <Route path='/product-review/:id' element={<WriteProductReview />} />
          <Route path='user-review/:id' element={<WriteUserReview />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />

          <Route path='/products/register' element={<ProductRegister />} /> {/* 상품 등록 페이지 */}
          <Route path='/products/:productId' element={<ProductDetail />} /> {/* 상품 상세 페이지 */}
          <Route path='/products/:productId/edit' element={<ProductEdit />} /> {/* 상품 수정 페이지 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
