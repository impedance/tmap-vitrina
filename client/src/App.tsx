import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Catalog from './pages/Catalog';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/p/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* Redirect old routes if any */}
        <Route path="/product/:id" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<Navigate to="/?admin=1" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

