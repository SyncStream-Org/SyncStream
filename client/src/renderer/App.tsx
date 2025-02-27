import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Launch from '../pages/launch/launch';
import Home from '../pages/home/home';
import Settings from '../pages/settings/settings';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Launch />} />
        <Route path="/home" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
