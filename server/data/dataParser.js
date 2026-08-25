const fs = require('fs');
const readline = require('readline');
const path = require('path');

// The Scryfall bulk JSONL files to read.
const INPUTS = [
  path.join(__dirname, 'cards.jsonl'),
  path.join(__dirname, 'cards2.jsonl'),
];
const OUTPUT = path.join(__dirname, 'combined-cards.json');

function extractRow(card) {
  // Image: top-level, falling back to the first face for double-faced cards.
  let imageUrl = null;
  if (card.image_uris) {
    imageUrl = card.image_uris.normal;
  } else if (
    card.card_faces &&
    card.card_faces[0] &&
    card.card_faces[0].image_uris
  ) {
    imageUrl = card.card_faces[0].image_uris.normal;
  }

  // Mana cost / oracle text / type line: top-level, falling back to the first face.
  let manaCost = card.mana_cost;
  let oracleText = card.oracle_text;
  let typeLine = card.type_line;
  if (card.card_faces && card.card_faces[0]) {
    if (!manaCost) manaCost = card.card_faces[0].mana_cost;
    if (oracleText === undefined || oracleText === null)
      oracleText = card.card_faces[0].oracle_text;
    if (!typeLine) typeLine = card.card_faces[0].type_line;
  }

  const prices = card.prices || {};

  return {
    name: card.name,
    mana_cost: manaCost || null,
    oracle_text: oracleText || null,
    set_name: card.set_name || null,
    set_code: card.set || null,
    price_usd: prices.usd || null,
    type_line: typeLine || null,
    image_url: imageUrl,
  };
}

async function run() {
  const rows = [];

  for (const input of INPUTS) {
    const rl = readline.createInterface({
      input: fs.createReadStream(input),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (!line.trim()) continue;
      const card = JSON.parse(line);

      // English only, and skip digital-only printings (MTGO/Arena prices,
      // not paper USD). Every paper printing is kept.
      if (card.lang !== 'en') continue;
      if (card.digital === true) continue;

      rows.push(extractRow(card));
    }
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(rows, null, 2));
  console.log(`Wrote ${rows.length} printings to ${OUTPUT}`);
}

run();
