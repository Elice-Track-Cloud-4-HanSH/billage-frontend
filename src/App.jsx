import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Easteregg from '@/pages/Easteregg.jsx';
import ChatroomList from '@/pages/ChatroomList.jsx';
import '@/styles/global.css';
import Layout from '@/layouts/Layout.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/easter-egg' element={<Easteregg />} />
          <Route path='/chat' element={<ChatroomList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
