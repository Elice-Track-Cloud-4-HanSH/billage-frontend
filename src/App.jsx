import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Easteregg from '@/Easteregg.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/easter-egg' element={<Easteregg />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
