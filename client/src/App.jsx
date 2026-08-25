import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Header from './components/Header';
import Cards from './components/Cards';
import Collection from './components/Collection';
import Decks from './components/Decks';
import DeckDetails from './components/DeckDetails';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Cards />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/decks" element={<Decks />} />
          <Route path="/decks/:deckId" element={<DeckDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
