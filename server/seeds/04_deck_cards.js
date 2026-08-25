/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('deck_cards').del();

  const deckLists = [
    {
      deckName: 'Return of the King',
      cards: [
        { name: 'Aragorn, the Uniter', quantity: 1, is_commander: true },
        { name: 'Aragorn, Company Leader', quantity: 1 },
        { name: 'Assault on Osgiliath', quantity: 1 },
      ],
    },
    {
      deckName: 'I ❤︎⁠ Liv Tyler',
      cards: [
        { name: 'Arwen, Mortal Queen', quantity: 1, is_commander: true },
        { name: 'Arwen Undómiel', quantity: 1 },
        { name: "Arwen's Gift", quantity: 1 },
        { name: 'Chance-Met Elves', quantity: 1 },
      ],
    },
    {
      deckName: 'What about Second Breakfast?',
      cards: [
        { name: 'Bilbo, Retired Burglar', quantity: 1, is_commander: true },
        { name: 'Delighted Halfling', quantity: 1 },
        { name: 'Bag End Porter', quantity: 1 },
        { name: 'Brandywine Farmer', quantity: 1 },
      ],
    },
  ];

  const deckCardRows = [];
  for (let i = 0; i < deckLists.length; i++) {
    const deck = await knex('decks')
      .where({ name: deckLists[i].deckName })
      .first();
    if (!deck) continue;

    for (let j = 0; j < deckLists[i].cards.length; j++) {
      const cardEntry = deckLists[i].cards[j];
      const card = await knex('cards').where({ name: cardEntry.name }).first();
      if (!card) continue;
      deckCardRows.push({
        deck_id: deck.id,
        card_id: card.id,
        quantity: cardEntry.quantity,
        is_commander: cardEntry.is_commander || false,
      });
    }
  }

  if (deckCardRows.length > 0) {
    await knex('deck_cards').insert(deckCardRows);
  }
};
