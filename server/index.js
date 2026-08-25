const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const knex = require('knex')(require('./knexfile.js')['development']);

app.use(cors());
app.use(express.json());

const parsePrice = (priceString) => {
  if (priceString === null || priceString === undefined) {
    return null;
  }
  return parseFloat(priceString);
};

app.get('/', (req, res) => res.status(200).json({ status: 'ok' }));

app.get('/cards', (req, res) => {
  knex('cards')
    .select('*')
    .then((cardData) => {
      res.status(200).json(cardData);
    });
});

app.get('/collection', (req, res) => {
  knex('collection')
    .join('cards', 'collection.card_id', '=', 'cards.id')
    .select(
      'cards.id',
      'cards.name',
      'cards.mana_cost',
      'cards.type_line',
      'cards.oracle_text',
      'cards.set_code',
      'cards.set_name',
      'collection.quantity',
      'cards.usd',
      'cards.image_url',
    )
    .then((cardData) => {
      const parsedData = cardData.map((card) => {
        const usd = parsePrice(card.usd);
        return {
          ...card,
          usd,
          total: usd === null ? null : usd * card.quantity,
        };
      });
      res.status(200).json(parsedData);
    });
});

app.get('/decks', (req, res) => {
  knex('decks')
    .select('*')
    .then((deckData) => res.status(200).json(deckData));
});

app.get('/decks/:deckID', (req, res) => {
  const { deckID } = req.params;
  Promise.all([
    knex('decks').select('*').where('id', deckID).first(),
    knex('deck_cards')
      .join('cards', 'deck_cards.card_id', '=', 'cards.id')
      .select(
        'cards.name',
        'cards.set_name',
        'cards.usd',
        'deck_cards.quantity',
        'deck_cards.is_commander',
        'cards.image_url',
      )
      .where('deck_cards.deck_id', deckID),
  ]).then(([deck, cards]) => {
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.status(200).json({ ...deck, cards });
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
