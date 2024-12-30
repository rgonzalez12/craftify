import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import MyItems from './components/MyItems';
import ItemDetail from './components/ItemDetail';
import CreateItem from './components/CreateItem';
import EditItem from './components/EditItem';
import Login from './components/Login';
import Signup from './components/Signup';
import Cart from './components/Cart';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import DeleteUser from './components/DeleteUser';
import Checkout from './components/Checkout';
import MyOrders from './components/MyOrders';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<MyItems />} />
        <Route path="/items/create" element={<CreateItem />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/items/:id/edit" element={<EditItem />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/:id/edit" element={<EditProfile />} />
        <Route path="/delete_user/:id" element={<DeleteUser />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/myorders" element={<MyOrders />} />
      </Routes>
    </Layout>
  );
}

export default App;