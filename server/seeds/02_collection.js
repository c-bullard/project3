/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('collection').del();

  const cards = [
    { name: 'Sol Ring', quantity: 2 },
    { name: 'Lightning Bolt', quantity: 4 },
    { name: 'Counterspell', quantity: 3 },
    { name: 'Llanowar Elves', quantity: 4 },
    { name: 'Birds of Paradise', quantity: 1 },
    { name: 'Cultivate', quantity: 2 },
  ];

  const collectionRows = [];
  for (let i = 0; i < cards.length; i++) {
    const card = await knex('cards').where({ name: cards[i].name }).first();
    if (card) {
      collectionRows.push({ card_id: card.id, quantity: cards[i].quantity });
    }
  }

  await knex('collection').insert(collectionRows);
};
