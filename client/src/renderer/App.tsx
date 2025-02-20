import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Launch from '../pages/launch/launch';
import Home from '../pages/home/home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Launch />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}
