import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Cards from './components/Cards';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Cards />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
