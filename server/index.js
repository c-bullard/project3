require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.status(200).json({ status: 'ok' }));

app.listen(port, () => console.log(`Server listening on port ${port}`));
