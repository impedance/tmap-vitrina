import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Showcase from './pages/Showcase';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import WebApp from '@twa-dev/sdk';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]">
        <Routes>
          <Route path="/" element={<Showcase />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
