import { useEffect, useState } from 'react';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import CardDetails from './CardDetails';
import '../styles/cards.css';

const cardsPerPage = 48;

export default function Collection() {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8080/collection');
        if (!response.ok) {
          throw new Error(`error status: ${response.status}`);
        }
        const data = await response.json();
        setCards(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (cards.length === 0) {
    return <p className="status-message">No cards in collection</p>;
  }

  if (loading) {
    return <p className="status-message">Loading cards...</p>;
  }

  if (error) {
    return <p className="status-message">Error: {error}</p>;
  }

  const removeFromCollection = async (card) => {
    try {
      await fetch(`http://localhost:8080/collection/${card.id}`, {
        method: 'DELETE',
      });
      setCards((prev) =>
        prev
          .map((c) =>
            c.id === card.id ? { ...c, quantity: c.quantity - 1 } : c,
          )
          .filter((c) => c.quantity > 0),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const collectionTotal = cards.reduce(
    (sum, card) => sum + (card.usd != null ? card.usd * card.quantity : 0),
    0,
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCards.length / cardsPerPage),
  );
  const startIndex = (page - 1) * cardsPerPage;
  const visibleCards = filteredCards.slice(
    startIndex,
    startIndex + cardsPerPage,
  );

  return (
    <>
      <SearchBar value={search} onChange={handleSearchChange} />
      <p className="collection-total">Total value: ${collectionTotal}</p>
      {filteredCards.length === 0 ? (
        <p className="status-message">No cards match "{search}".</p>
      ) : (
        <>
          <div className="card-grid">
            {visibleCards.map((card) => (
              <button key={card.id} onClick={() => setSelectedCard(card)}>
                <div className="card">
                  <img src={card.image_url} alt={card.name} />
                  <span className="card-quantity-badge">x{card.quantity}</span>
                </div>
              </button>
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
          <CardDetails
            card={selectedCard}
            open={selectedCard !== null}
            onClose={() => setSelectedCard(null)}
            onAction={removeFromCollection}
            actionLabel="Remove from collection"
          />
        </>
      )}
    </>
  );
}
