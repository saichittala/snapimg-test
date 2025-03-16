import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './home.js';
import Compressimages from './pages/compressimages.js';
import ConvertTojpg from './pages/convertjpg.js';
import ConvertTopng from './pages/convertpng.js';
import ConvertTowebp from './pages/convertwebp.js';
import ConvertToPdf from './pages/convertpdf.js';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';

function AppContent() {
  const location = useLocation(); // Get the current location

  // Define routes where the footer should NOT be displayed
  const noFooterRoutes = ['/convertpdf', '/convertwebp', '/convertpng', '/convertjpg', '/compressimages']; // Add paths as needed

  // Check if the current route is in the noFooterRoutes array
  const shouldShowFooter = !noFooterRoutes.includes(location.pathname);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compressimages" element={<Compressimages />} />
        <Route path="/convertjpg" element={<ConvertTojpg />} />
        <Route path="/convertpng" element={<ConvertTopng />} />
        <Route path="/convertpdf" element={<ConvertToPdf />} />
        <Route path="/convertwebp" element={<ConvertTowebp />} />
      </Routes>
      {shouldShowFooter && <Footer />} {/* Conditionally render Footer */}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;