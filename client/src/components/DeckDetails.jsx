import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/decks.css';

export default function DeckDetails() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="deck-list">
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
