# Stock Market Search App

A full-stack stock search and portfolio application built for CSCI 571 Homework 3. The app uses Angular and Bootstrap on the frontend, Node.js/Express on the backend, MongoDB Atlas for persistence, and server-side proxy routes for Finnhub and Polygon.io market data.

## Features

- **Stock search with autocomplete:** users can type a company name or ticker symbol and choose from matching common-stock suggestions before navigating to the stock details page.
- **Detailed quote view:** each searched ticker shows company identity, exchange, logo, latest price, price change, percent change, timestamp, and whether the market is currently open or closed.
- **Summary tab:** displays day-level quote values such as high, low, open, and previous close, along with company profile details including IPO date, industry, website, and related peer tickers.
- **Top news tab:** loads recent company news and presents article cards with images and headlines. Selecting a card opens a modal with source, publication date, title, summary, article link, and social sharing options.
- **Charts tab:** uses Highcharts to visualize historical stock data from Polygon.io, including price and volume trends over a longer time window.
- **Insights tab:** summarizes insider sentiment values and displays recommendation trends and earnings data using charts and tables.
- **Watchlist management:** users can star a stock to save it to a MongoDB-backed watchlist, remove saved stocks, and open a stock details page directly from a watchlist card.
- **Portfolio trading simulation:** users can buy and sell shares through modal dialogs that validate quantity, available wallet balance, and owned share count before submitting a transaction.
- **Wallet tracking:** the app maintains a simulated cash balance in MongoDB and updates it after buy and sell operations.
- **Portfolio analytics:** owned positions show quantity, total cost, average cost per share, current price, market value, and gain/loss styling based on stock movement.
- **Responsive interface:** pages, cards, modals, tabs, and navigation are designed to work across desktop and mobile screen sizes.
- **Server-side API proxying:** Finnhub and Polygon.io requests are made through the Node.js backend so API keys are not exposed in Angular/browser code.

## Tech Stack

- Frontend: Angular 17, Angular Material, Bootstrap, ng-bootstrap, Highcharts
- Backend: Node.js, Express, Axios
- Database: MongoDB Atlas
- APIs: Finnhub Stock API, Polygon.io Aggregates API
- Deployment target: Google App Engine, AWS, Azure, or another Node.js-capable cloud service

## Project Structure

```text
.
├── app.js                 # Express backend and API proxy routes
├── app.yaml               # Google App Engine config
├── package.json           # Backend dependencies and start script
├── .env.example           # Required environment variables
└── frontend/              # Angular application
    ├── angular.json
    ├── package.json
    └── src/app/
```

## Environment Variables

Create a local `.env` file in the project root using `.env.example` as a template:

```bash
PORT=3000
MONGO_URI=your_mongodb_connection_string
DB_NAME=your_database_name
FINNHUB_API_KEY=your_finnhub_api_key
POLYGON_API_KEY=your_polygon_api_key
```

Do not commit `.env`. API keys and database credentials should be configured through environment variables or your cloud provider's secret/config system.

## Backend Setup

Install backend dependencies from the project root:

```bash
npm install
```

Start the Express server:

```bash
npm start
```

By default, the backend listens on `http://localhost:3000` unless `PORT` is set.

## Frontend Setup

Install frontend dependencies:

```bash
cd frontend
npm install
```

Run the Angular dev server:

```bash
npm start
```

The Angular app runs at `http://localhost:4200`.

Build the frontend:

```bash
npm run build
```

The production build is generated under `frontend/dist/frontend`.

## Main Backend Routes

Stock data routes:

- `GET /stockSearchAutocompleteAPI`
- `GET /het?userInputQuery=<query>`
- `GET /companyProfile?userInputQuery=<ticker>`
- `GET /stockQuote?userInputQuery=<ticker>`
- `GET /companyPeers?userInputQuery=<ticker>`
- `GET /companyNews?userInputQuery=<ticker>`
- `GET /insiderSentiment?userInputQuery=<ticker>`
- `GET /stockRecommendation?userInputQuery=<ticker>`
- `GET /stockEarnings?userInputQuery=<ticker>`
- `GET /poly?userInputQuery=<ticker>&fromDate=<date>&toDate=<date>`
- `GET /stockQuoteForChartsTab?userInputQuery=<ticker>`

MongoDB routes:

- `GET /api/MSCollection/getData`
- `POST /api/MSCollection/postData`
- `DELETE /api/MSCollection/deleteData/:id`
- `GET /api/MSPortfolio/getData`
- `POST /api/MSPortfolio/postData`
- `PUT /api/MSPortfolio/updateData/:id`
- `DELETE /api/MSPortfolio/deleteData/:id`
- `GET /api/miscCollection/getData`
- `PUT /api/miscCollection/updateData/:id`

## Database Collections

The backend expects MongoDB collections for:

- `MSCollection`: watchlist entries
- `MSPortfolio`: portfolio holdings
- `miscCollection`: wallet data

The wallet collection should include an initial document with a `totalMoneyInWallet` value, typically `25000`.

## Deployment Notes

- Set all required environment variables in the cloud environment.
- Keep API keys on the Node.js server only.
- Ensure the deployed Angular frontend sends stock and MongoDB requests to the deployed backend.
- For Google App Engine, update `app.yaml` as needed for your project and runtime configuration.

## Verification

Useful checks before deployment:

```bash
node --check app.js
cd frontend
npm run build
```

The Angular build may show warnings for CommonJS dependencies such as Highcharts modules; these warnings do not block the build.
