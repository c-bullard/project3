import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/decks.css';

export default function Decks() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8080/decks');
        if (!response.ok) {
          throw new Error(`error status: ${response.status}`);
        }
        const data = await response.json();
        setDecks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="status-message">Loading decks...</p>;
  }

  if (error) {
    return <p className="status-message">Error: {error}</p>;
  }

  return (
    <>
      <div className="deck-list">
        <table>
          <caption>My Deck List</caption>
          <thead>
            <tr>
              <th>Deck ID</th>
              <th>Deck Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {decks.map((deck) => (
              <tr
                key={deck.id}
                className="deck-row"
                onClick={() => navigate(`/decks/${deck.id}`)}
              >
                <td>{deck.id}</td>
                <td>{deck.name}</td>
                <td>{deck.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
