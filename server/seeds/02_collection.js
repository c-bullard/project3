/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// exports.seed = async function (knex) {
//   // Deletes ALL existing entries
//   await knex('collection').del();

//   const cards = [
//     { name: 'Delighted Halfling', quantity: 2 },
//     { name: 'Aragorn, the Uniter', quantity: 1 },
//     { name: 'Arwen, Mortal Queen', quantity: 1 },
//     { name: 'Bilbo, Retired Burglar', quantity: 3 },
//     { name: 'Assault on Osgiliath', quantity: 2 },
//     { name: 'Bag End Porter', quantity: 4 },
//   ];

//   const collectionRows = [];
//   for (let i = 0; i < cards.length; i++) {
//     const card = await knex('cards').where({ name: cards[i].name }).first();
//     if (card) {
//       collectionRows.push({ card_id: card.id, quantity: cards[i].quantity });
//     }
//   }

//   await knex('collection').insert(collectionRows);
// };

const fs = require('fs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('collection').del();

  const cards = JSON.parse(fs.readFileSync('/app/data/collection.json'));

  // Aggregate quantities per resolved card so each card_id is inserted once.
  // Multiple JSON entries can resolve to the same card (e.g. a printing that
  // only matches via the name-only fallback), which would otherwise create
  // duplicate collection rows for one card.
  const quantityByCardId = new Map();
  for (let i = 0; i < cards.length; i++) {
    let card = await knex('cards')
      .where({ name: cards[i].name, set_code: cards[i].set_code })
      .first();
    if (!card) {
      card = await knex('cards').where({ name: cards[i].name }).first();
    }
    if (card) {
      const current = quantityByCardId.get(card.id) || 0;
      quantityByCardId.set(card.id, current + cards[i].quantity);
    }
  }

  const collectionRows = [...quantityByCardId].map(([card_id, quantity]) => ({
    card_id,
    quantity,
  }));
  await knex.batchInsert('collection', collectionRows, 500);
};
