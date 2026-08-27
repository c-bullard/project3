const express = require('express');
const knex = require('knex')(require('../knexfile.js')['development']);
const handleError = require('../scripts/errorHandler');

const router = express.Router();

router.get('/', (req, res) => {
  knex('cards')
    .select('*')
    .then((cardData) => {
      res.status(200).json(cardData);
    })
    .catch((err) => handleError(res, err));
});

module.exports = router;
