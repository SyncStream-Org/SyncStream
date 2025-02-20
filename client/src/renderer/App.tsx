import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Launch from '../pages/launch/launch';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Launch />} />
      </Routes>
    </Router>
  );
}
