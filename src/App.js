

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home.js';
import Navbar from './Navbar.js';
import CrawlLinks from './CrawlLinks.js';
import CrawlImages from './CrawlImages.js';
import './App.css';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/Home" />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/CrawlLinks" element={<CrawlLinks />} />
                <Route path="/CrawlImages" element={<CrawlImages />} />
            </Routes>
        </Router>
    );
}

export default App;
