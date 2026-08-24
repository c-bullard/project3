var fs = require('fs');

const parsePrice = (priceString) => {
  if (priceString === null || priceString === undefined) {
    return null;
  }
  return parseFloat(priceString);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('cards').del();

  const rows = JSON.parse(
    fs.readFileSync('/home/chad/sdi/project3/server/data/cards.json'),
  );
  const cardRows = rows.map((row) => {
    return {
      name: row.name,
      mana_cost: row.mana_cost,
      oracle_text: row.oracle_text,
      set_name: row.set_name,
      image_url: row.image_url,
      usd: parsePrice(row.usd),
    };
  });

  await knex.batchInsert('cards', cardRows, 500);
};
