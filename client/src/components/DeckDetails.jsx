import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/decks.css';

export default function DeckDetails() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isCommander, setIsCommander] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8080/decks/${deckId}`);
        if (!response.ok) {
          throw new Error(`error status: ${response.status}`);
        }
        const data = await response.json();
        setDeck(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [deckId]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:8080/collection');
        if (!response.ok) {
          throw new Error(`error status: ${response.status}`);
        }
        const data = await response.json();
        setCards(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCards();
  }, []);

  const handleAddCard = async (event) => {
    event.preventDefault();
    if (!selectedCard || adding) {
      return;
    }

    setAdding(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/decks/${deckId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: selectedCard.id,
          quantity,
          is_commander: isCommander,
        }),
      });
      if (!response.ok) {
        throw new Error(`error status: ${response.status}`);
      }

      const deckResponse = await fetch(`http://localhost:8080/decks/${deckId}`);
      if (!deckResponse.ok) {
        throw new Error(`error status: ${deckResponse.status}`);
      }
      const data = await deckResponse.json();
      setDeck(data);
      setSearch('');
      setSelectedCard(null);
      setQuantity(1);
      setIsCommander(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <p className="status-message">Loading deck...</p>;
  }

  if (error) {
    return <p className="status-message">Error: {error}</p>;
  }

  if (!deck) {
    return null;
  }

  const cardCount = deck.cards.reduce(
    (total, card) => total + card.quantity,
    0,
  );

  const totalPrice = deck.cards.reduce(
    (total, card) => total + (card.usd ?? 0),
    0,
  );

  const searchTerm = search.trim().toLowerCase();
  const matches = searchTerm
    ? cards
        .filter((card) => card.name.toLowerCase().includes(searchTerm))
        .slice(0, 10)
    : [];

  return (
    <div className="deck-list">
      <form className="deck-add-card-form" onSubmit={handleAddCard}>
        <div className="deck-add-card-search">
          <input
            type="text"
            className="search-bar"
            placeholder="Search cards to add..."
            value={selectedCard ? selectedCard.name : search}
            onChange={(event) => {
              setSelectedCard(null);
              setSearch(event.target.value);
            }}
          />
          {matches.length > 0 && (
            <ul className="deck-add-card-results">
              {matches.map((card) => (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCard(card);
                      setSearch('');
                    }}
                  >
                    {card.name}
                    {card.set_name ? ` — ${card.set_name}` : ''}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <label>
          Qty
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(Math.max(1, Number(event.target.value)))
            }
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={isCommander}
            onChange={(event) => setIsCommander(event.target.checked)}
          />
          Commander
        </label>
        <button type="submit" disabled={!selectedCard || adding}>
          {adding ? 'Adding...' : 'Add Card'}
        </button>
      </form>
      <table>
        <caption>{deck.name}</caption>
        <thead>
          <tr>
            <th>Card Name</th>
            <th>Quantity</th>
            <th>Set</th>
            <th>Price</th>
            <th>Commander</th>
          </tr>
        </thead>
        <tbody>
          {deck.cards.map((card, index) => (
            <tr key={`${card.name}-${index}`} className="deck-card-row">
              <td className="deck-card-name">
                {card.name}
                <img
                  className="deck-card-preview"
                  src={card.image_url}
                  alt={card.name}
                />
              </td>
              <td>{card.quantity}</td>
              <td>{card.set_name}</td>
              <td>{card.usd != null ? `$${card.usd}` : '—'}</td>
              <td>{card.is_commander ? 'Yes' : ''}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{cardCount}</td>
            <td></td>
            <td>${totalPrice.toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
