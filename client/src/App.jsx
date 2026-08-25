import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Cards from './components/Cards';
import CardDetails from './components/CardDetails';
import Collection from './components/Collection';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Cards />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/test" element={<CardDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
