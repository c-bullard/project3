const parsePrice = (priceString) => {
  if (priceString === null || priceString === undefined) {
    return null;
  }
  return parseFloat(priceString);
};

module.exports = parsePrice;
