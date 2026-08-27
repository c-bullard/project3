const express = require('express');
const knex = require('knex')(require('../knexfile.js')['development']);
const parsePrice = require('../scripts/parsePrice');
const handleError = require('../scripts/errorHandler');

const router = express.Router();

router.get('/', (req, res) => {
  knex('decks')
    .select('*')
    .then((deckData) => res.status(200).json(deckData))
    .catch((err) => handleError(res, err));
});

router.post('/', (req, res) => {
  const { name, description } = req.body;
  knex('decks')
    .insert({ name, description })
    .then(() => res.status(200).json({ status: 'ok' }))
    .catch((err) => handleError(res, err));
});

router.get('/:deckID', (req, res) => {
  const { deckID } = req.params;
  Promise.all([
    knex('decks').select('*').where('id', deckID).first(),
    knex('deck_cards')
      .join('cards', 'deck_cards.card_id', '=', 'cards.id')
      .select(
        'deck_cards.id as deck_card_id',
        'cards.name',
        'cards.set_name',
        'cards.usd',
        'deck_cards.quantity',
        'deck_cards.is_commander',
        'cards.image_url',
      )
      .where('deck_cards.deck_id', deckID),
  ])
    .then(([deck, cards]) => {
      if (!deck) {
        return res.status(404).json({ error: 'Deck not found' });
      }
      const parsedCards = cards.map((card) => ({
        ...card,
        usd: parsePrice(card.usd),
      }));
      res.status(200).json({ ...deck, cards: parsedCards });
    })
    .catch((err) => handleError(res, err));
});

router.post('/:deckID', (req, res) => {
  const { deckID } = req.params;
  const { card_id, quantity, is_commander } = req.body;
  knex('deck_cards')
    .insert({ deck_id: deckID, card_id, quantity, is_commander })
    .then(() =>
      res.status(200).json({ message: `Card added to deck: ${deckID}` }),
    )
    .catch((err) => handleError(res, err));
});

router.delete('/:deckID/cards/:deckCardID', (req, res) => {
  const { deckID, deckCardID } = req.params;
  knex('deck_cards')
    .where({ id: deckCardID, deck_id: deckID })
    .del()
    .then((count) => {
      if (!count) {
        return res.status(404).json({ error: 'Card not found in deck' });
      }
      res.status(200).json({ message: 'Card removed from deck' });
    })
    .catch((err) => handleError(res, err));
});

router.delete('/:deckID', (req, res) => {
  const { deckID } = req.params;
  knex('decks')
    .where({ id: deckID })
    .first()
    .then((existing) => {
      if (!existing) {
        return res.status(404).json({ error: 'Deck not found' });
      }
      return knex('deck_cards')
        .where({ deck_id: deckID })
        .del()
        .then(() => knex('decks').where({ id: deckID }).del())
        .then(() =>
          res.status(200).json({ message: 'Deck successfully deleted' }),
        );
    })
    .catch((err) => handleError(res, err));
});

module.exports = router;
