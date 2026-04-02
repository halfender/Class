require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analyzeRouter = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', analyzeRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'LeaseLens API is running' });
});

app.listen(PORT, () => {
  console.log(`LeaseLens backend running on port ${PORT}`);
});

module.exports = app;
