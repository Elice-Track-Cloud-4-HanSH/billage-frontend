import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Easteregg from '@/pages/Easteregg.jsx';
import ChatroomList from '@/pages/ChatroomList.jsx';
import '@/styles/global.css';
import Layout from '@/layouts/Layout.jsx';
import MyReview from '@/pages/MyReview';
import MySales from './pages/MySales';
import MyPurchase from './pages/MyPurchase';
import ProductRegister from '@/pages/product/ProductRegister';
import WriteProductReview from './pages/WriteProductReview';
import WriteUserReview from './pages/WriteUserReview.jsx';
import ProductDetail from '@/pages/product/ProductDetail';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/easter-egg' element={<Easteregg />} />
          <Route path='/chat' element={<ChatroomList />} />
          <Route path='/myreview' element={<MyReview />} />
          <Route path='/mysales' element={<MySales />} />
          <Route path='/mypurchase' element={<MyPurchase />} />
          <Route path='/product-review/:id' element={<WriteProductReview />} />
          <Route path='user-review/:id' element={<WriteUserReview />} />

          <Route path='/product/register' element={<ProductRegister />} /> {/* 상품 등록 페이지 */}
          <Route path='/product/:productId' element={<ProductDetail />} /> {/* 상품 상세 페이지 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
