/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('collection').del();

  const cards = [
    { name: 'Delighted Halfling', quantity: 2 },
    { name: 'Aragorn, the Uniter', quantity: 1 },
    { name: 'Arwen, Mortal Queen', quantity: 1 },
    { name: 'Bilbo, Retired Burglar', quantity: 3 },
    { name: 'Assault on Osgiliath', quantity: 2 },
    { name: 'Bag End Porter', quantity: 4 },
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
