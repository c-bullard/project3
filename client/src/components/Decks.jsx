import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/decks.css';

export default function Decks() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

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

  const createDeck = async (event) => {
    event.preventDefault();
    if (!name.trim() || creating) {
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });
      if (!response.ok) {
        throw new Error(`error status: ${response.status}`);
      }

      const deckList = await fetch('http://localhost:8080/decks');
      if (!deckList.ok) {
        throw new Error(`error status: ${deckList.status}`);
      }
      const data = await deckList.json();
      setDecks(data);
      setName('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <p className="status-message">Loading decks...</p>;
  }

  if (error) {
    return <p className="status-message">Error: {error}</p>;
  }

  return (
    <>
      <form className="deck-create-form" onSubmit={createDeck}>
        <input
          type="text"
          className="search-bar"
          placeholder="Deck name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type="text"
          className="search-bar"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button type="submit" disabled={!name.trim() || creating}>
          Create Deck
        </button>
      </form>
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
