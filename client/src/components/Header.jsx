import { Link } from 'react-router-dom';
import '../styles/header.css';

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-title">
        Magic the Gathering
      </Link>
      <nav className="site-nav">
        <Link to="/">Cards</Link>
        <Link to="/collection">Collection</Link>
        <Link to="/decks">Decks</Link>
      </nav>
    </header>
  );
}
