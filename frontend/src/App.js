import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import SupplierList from './pages/SupplierList';
import SupplierDetail from './pages/SupplierDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/suppliers/new" element={<SupplierDetail />} />
        <Route path="/suppliers/:id" element={<SupplierDetail />} />
      </Routes>
    </Router>
  );
}

export default App;