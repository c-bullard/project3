const express = require('express');
const knex = require('knex')(require('../knexfile.js')['development']);
const parsePrice = require('../scripts/parsePrice');
const handleError = require('../scripts/errorHandler');

const router = express.Router();

router.get('/', (req, res) => {
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
    })
    .catch((err) => handleError(res, err));
});

router.post('/', (req, res) => {
  const { card_id } = req.body;

  knex('collection')
    .where({ card_id })
    .first()
    .then((existing) => {
      if (existing) {
        return knex('collection').where({ card_id }).increment('quantity', 1);
      }
      return knex('collection').insert({ card_id, quantity: 1 });
    })
    .then(() => res.status(200).json({ status: 'ok' }))
    .catch((err) => handleError(res, err));
});

router.put('/:cardID', (req, res) => {
  const { cardID } = req.params;
  const { quantity } = req.body;

  knex('collection')
    .where({ card_id: cardID })
    .first()
    .then((existing) => {
      if (!existing) {
        return res.status(404).json({ error: 'Card not in collection' });
      }
      if (quantity === 0) {
        return knex('collection')
          .where({ card_id: cardID })
          .del()
          .then(() =>
            res.status(200).json({ message: 'Card successfully deleted.' }),
          );
      }
      return knex('collection')
        .where({ card_id: cardID })
        .update({ quantity })
        .then(() => res.status(200).json({ status: 'ok', quantity }));
    })
    .catch((err) => handleError(res, err));
});

router.delete('/:cardID', (req, res) => {
  const { cardID } = req.params;

  knex('collection')
    .where({ card_id: cardID })
    .first()
    .then((existing) => {
      if (!existing) {
        return res.status(404).json({ error: 'Card not in collection' });
      }
      if (existing.quantity > 1) {
        return knex('collection')
          .where({ card_id: cardID })
          .decrement('quantity', 1)
          .then(() => res.status(200).json({ status: 'ok' }));
      }
      return knex('collection')
        .where({ card_id: cardID })
        .del()
        .then(() =>
          res.status(200).json({ message: 'Card successfully deleted.' }),
        );
    })
    .catch((err) => handleError(res, err));
});

module.exports = router;
