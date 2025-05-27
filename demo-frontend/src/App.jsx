import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import { Home, OrderManagement, ProductManagement, SignIn, UserManagement } from './pages';
import { Layout } from './components';

function App() {

  
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path='/' element={<Home/>} />
        <Route path='/userManagement' element={<UserManagement/>} />
        <Route path='/productManagement' element={<ProductManagement/>} />
        <Route path='/orderManagement' element={<OrderManagement/>} />
      </Route>
      <Route path="/signIn" element={<SignIn/>} />
    </Routes>
  );
}

export default App;
