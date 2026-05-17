require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ---------------- ENV ---------------- */
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

/* ---------------- DB ---------------- */
let db;

async function connectDB() {
  const client = await MongoClient.connect(MONGO_URI);
  db = client.db(DB_NAME);
  console.log('MongoDB connected');
}

connectDB();

/* ---------------- HELPERS ---------------- */
const finnhub = (url) =>
  axios.get(url + `&token=${FINNHUB_API_KEY}`);

const polygon = (url) =>
  axios.get(url + `&apiKey=${POLYGON_API_KEY}`);

/* ---------------- ROUTES ---------------- */

app.get('/', (req, res) => {
  res.send('API running');
});

/* ===== STOCK SEARCH ===== */
app.get('/stockSearchAutocompleteAPI', async (req, res) => {
  const r = await finnhub(
    'https://finnhub.io/api/v1/stock/symbol?exchange=US'
  );
  res.json(r.data);
});

app.get('/het', async (req, res) => {
  const { userInputQuery } = req.query;

  const r = await finnhub(
    `https://finnhub.io/api/v1/search?q=${userInputQuery}&exchange=US`
  );

  res.json(r.data.result);
});

/* ===== COMPANY ===== */
app.get('/companyProfile', async (req, res) => {
  const { userInputQuery } = req.query;

  const r = await finnhub(
    `https://finnhub.io/api/v1/stock/profile2?symbol=${userInputQuery}`
  );

  res.json(r.data);
});

app.get('/stockQuote', async (req, res) => {
  const { userInputQuery } = req.query;

  const r = await finnhub(
    `https://finnhub.io/api/v1/quote?symbol=${userInputQuery}`
  );

  res.json(r.data);
});

app.get('/companyPeers', async (req, res) => {
  const { userInputQuery } = req.query;

  const r = await finnhub(
    `https://finnhub.io/api/v1/stock/peers?symbol=${userInputQuery}`
  );

  res.json(r.data);
});

app.get('/insiderSentiment', async (req, res) => {
  const { userInputQuery } = req.query;

  const r = await finnhub(
    `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${userInputQuery}&from=2022-01-01`
  );

  res.json(r.data);
});

/* ===== POLYGON ===== */
app.get('/poly', async (req, res) => {
  const { userInputQuery, fromDate, toDate } = req.query;

  const url = `https://api.polygon.io/v2/aggs/ticker/${userInputQuery}/range/1/hour/${fromDate}/${toDate}`;

  const r = await polygon(url);

  res.json(r.data);
});

app.get('/stockQuoteForChartsTab', async (req, res) => {
  const symbol = req.query.userInputQuery.toUpperCase();

  const now = new Date();
  const end = now.toISOString().slice(0, 10);

  now.setFullYear(now.getFullYear() - 2);
  const start = now.toISOString().slice(0, 10);

  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${start}/${end}`;

  const r = await polygon(url);

  res.json(r.data);
});

/* ===== NEWS ===== */
app.get('/companyNews', async (req, res) => {
  const { userInputQuery } = req.query;

  const today = new Date().toISOString().slice(0, 10);

  const url = `https://finnhub.io/api/v1/company-news?symbol=${userInputQuery}&from=2023-08-15&to=${today}`;

  const r = await finnhub(url);

  res.json(r.data);
});

/* ===== RECOMMENDATIONS ===== */
app.get('/stockRecommendation', async (req, res) => {
  const { userInputQuery } = req.query;

  const r = await finnhub(
    `https://finnhub.io/api/v1/stock/recommendation?symbol=${userInputQuery}`
  );

  res.json(r.data);
});

app.get('/stockEarnings', async (req, res) => {
  const { userInputQuery } = req.query;

  const r = await finnhub(
    `https://finnhub.io/api/v1/stock/earnings?symbol=${userInputQuery}`
  );

  res.json(r.data);
});

/* ---------------- MONGO ---------------- */

/* WATCHLIST */
app.get('/api/MSCollection/getData', async (req, res) => {
  const data = await db.collection('MSCollection').find({}).toArray();
  res.json(data);
});

app.post('/api/MSCollection/postData', async (req, res) => {
  const result = await db.collection('MSCollection').insertOne(req.body);
  res.json(result);
});

app.delete('/api/MSCollection/deleteBySymbol/:symbol', async (req, res) => {
  const { symbol } = req.params;

  const result = await db
    .collection('MSCollection')
    .deleteOne({ symbol });

  res.json(result);
});

/* PORTFOLIO */
app.get('/api/MSPortfolio/getData', async (req, res) => {
  const data = await db.collection('MSPortfolio').find({}).toArray();
  res.json(data);
});

app.post('/api/MSPortfolio/postData', async (req, res) => {
  const result = await db.collection('MSPortfolio').insertOne(req.body);
  res.json(result);
});

app.put('/api/MSPortfolio/updateData/:id', async (req, res) => {
  const { id } = req.params;
  const { _id, ...rest } = req.body;

  const result = await db.collection('MSPortfolio').updateOne(
    { _id: new ObjectId(id) },
    { $set: rest }
  );

  res.json(result);
});

app.delete('/api/MSPortfolio/deleteData/:id', async (req, res) => {
  const { id } = req.params;

  const result = await db.collection('MSPortfolio').deleteOne({
    _id: new ObjectId(id),
  });

  res.json(result);
});

/* ===== ERROR HANDLER ===== */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});