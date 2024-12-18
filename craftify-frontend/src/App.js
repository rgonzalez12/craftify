import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import MyItems from './components/MyItems';
import ItemDetail from './components/ItemDetail';
import Login from './components/Login';
import Signup from './components/Signup';
import Cart from './components/Cart';
import Profile from './components/Profile';
import DeleteUser from './components/DeleteUser';

function App() {
  return (
    <Layout>
      {/* Routes define which component to show for each path */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<MyItems />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/delete_user/:id" element={<DeleteUser />} />
      </Routes>
    </Layout>
  );
}

export default App;