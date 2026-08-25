import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Cards from './components/Cards';
import CardDetails from './components/CardDetails';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Cards />} />
          <Route path="/test" element={<CardDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
