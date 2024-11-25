import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Easteregg from '@/Easteregg.jsx';
import MyReview from './pages/MyReview';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/easter-egg' element={<Easteregg />} />
        <Route path='/myreview' element={<MyReview/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
