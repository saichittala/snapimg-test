import React from 'react';
import Home from './home.js';
import Compressimages from './pages/compressimages.js';
import ConvertTojpg from './pages/convertjpg.js';
import ConvertTopng from './pages/convertpng.js';
import ConvertTowebp from './pages/convertwebp.js';
import ConvertToPdf from './pages/convertpdf.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compressimages" element={<Compressimages />} />
        <Route path="/convertjpg" element={<ConvertTojpg />} />
        <Route path="/convertpng" element={<ConvertTopng />} />
        <Route path="/convertpdf" element={<ConvertToPdf />} />
        <Route path="/convertwebp" element={<ConvertTowebp />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
