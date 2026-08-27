const handleError = (res, err) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = handleError;
