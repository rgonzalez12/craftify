import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyItems from './components/MyItems';
import CreateItem from './components/CreateItem';
import EditItem from './components/EditItem';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyItems />} />
        <Route path="/create" element={<CreateItem />} />
        <Route path="/edit/:id" element={<EditItem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
