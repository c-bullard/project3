/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('deck_cards').del();

  const deckLists = [
    {
      deckName: 'Mono-Red Aggro',
      cards: [
        { name: 'Lightning Bolt', quantity: 4 },
        { name: 'Sol Ring', quantity: 1 },
      ],
    },
    {
      deckName: 'Azorius Control',
      cards: [
        { name: 'Counterspell', quantity: 4 },
        { name: 'Swords to Plowshares', quantity: 3 },
        { name: 'Brainstorm', quantity: 4 },
      ],
    },
    {
      deckName: 'Squirrels',
      cards: [
        {
          name: 'The Unbeatable Squirrel Girl',
          quantity: 1,
          is_commander: true,
        },
        { name: 'Earl of Squirrel', quantity: 1 },
        { name: 'Squirrel Sovereign', quantity: 1 },
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
