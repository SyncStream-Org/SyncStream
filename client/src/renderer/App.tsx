import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Launch from '../pages/launch/launch';
import Home from '../pages/home/home';
import Settings from '../pages/settings/settings';
import Room from '../pages/room/room';
import AdminPanel from '../pages/admin-panel/adminPanel';

export default function App() {
  return (
    <Router
      future={{
        v7_relativeSplatPath: false, // These silence the annoying future features warning
        v7_startTransition: false,
      }}
    >
      <Routes>
        <Route path="/" element={<Launch />} />
        <Route path="/home" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/room" element={<Room />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
