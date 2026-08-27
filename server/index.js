require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/cards', require('./routes/cards'));
app.use('/collection', require('./routes/collection'));
app.use('/decks', require('./routes/decks'));

app.listen(port, () => console.log(`Server listening on port ${port}`));
