import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface StockDataPoint {
  v: number;
  vw: number;
  o: number;
  c: number;
  h: number;
  l: number;
  t: number;
  n: number;
}

interface ChartsData {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: StockDataPoint[];
  status: string;
  request_id: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockkService {

  private baseURL = 'https://proj33004.wl.r.appspot.com';
  private apiKey = '***hidden***';

  private stockName = '';
  private walletAmount = 0;
  private boughtStockFlag = 0;

  constructor(private http: HttpClient) {}

  /* ---------------- STATE ---------------- */

  setStockName(value: string) {
    this.stockName = value;
  }

  getstockName(): string {
    return this.stockName;
  }

  setWalletNumber(value: number) {
    this.walletAmount = value;
  }

  getWalletNumber(): number {
    return this.walletAmount;
  }

  setBoughtStock(value: number) {
    this.boughtStockFlag = value;
  }

  getBoughtStock(): number {
    return this.boughtStockFlag;
  }

  /* ---------------- AUTOCOMPLETE ---------------- */

  fetchDataForAutoComplete(): Observable<any> {
    return this.http.get('/stockSearchAutocompleteAPI');
  }

  /* ---------------- COMPANY DATA ---------------- */

  fetchCompanyProfile(symbol: string): Observable<any> {
    return this.http.get(`/companyprofile?userInputQuery=${symbol}`);
  }

  fetchCompanyQuote(symbol: string): Observable<any> {
    return this.http.get(`/stockQuote?userInputQuery=${symbol}`);
  }

  fetchCompanyPeers(symbol: string): Observable<any> {
    return this.http.get(`/companyPeers?userInputQuery=${symbol}`);
  }

  fetchCompanyNews(symbol: string): Observable<any> {
    const toDate = new Date().toISOString().split('T')[0];

    return this.http.get(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}` +
      `&from=2023-08-15&to=${toDate}` +
      `&token=${this.apiKey}`
    );
  }

  /* ---------------- STOCK CHART DATA ---------------- */

  fetchStockHistory(symbol: string, fromDate: string, toDate: string): Observable<any> {
    return this.http.get(
      `/poly?userInputQuery=${symbol}&fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  fetchChartsData(symbol: string): Observable<ChartsData> {
    return this.http.get<ChartsData>(
      `/stockQuoteForChartsTab?userInputQuery=${symbol}`
    );
  }

  /* ---------------- INSIGHTS ---------------- */

  fetchInsiderSentiment(symbol: string): Observable<any> {
    return this.http.get(`/insiderSentiment?userInputQuery=${symbol}`);
  }

  fetchRecommendations(symbol: string): Observable<any> {
    return this.http.get(`/stockRecommendation?userInputQuery=${symbol}`);
  }

  fetchEarnings(symbol: string): Observable<any> {
    return this.http.get(`/stockEarnings?userInputQuery=${symbol}`);
  }

  /* ---------------- WALLET ---------------- */

  getWallet(): Observable<any> {
    return this.http.get('/api/miscCollection/getData');
  }

  updateWallet(id: string, data: any): Observable<any> {
    return this.http.put(`/api/miscCollection/updateData/${id}`, data);
  }

  /* ---------------- PORTFOLIO ---------------- */

  getPortfolio(): Observable<any> {
    return this.http.get('/api/MSPortfolio/getData');
  }

  addToPortfolio(data: any): Observable<any> {
    return this.http.post('/api/MSPortfolio/postData', data);
  }

  updatePortfolio(id: string, data: any): Observable<any> {
    return this.http.put(`/api/MSPortfolio/updateData/${id}`, data);
  }

  deletePortfolio(id: string): Observable<any> {
    return this.http.delete(`/api/MSPortfolio/deleteData/${id}`);
  }

  /* ---------------- WATCHLIST ---------------- */

  getWatchlist(): Observable<any> {
    return this.http.get('/api/MSCollection/getData');
  }

  addWatchlist(data: any): Observable<any> {
    return this.http.post('/api/MSCollection/postData', data);
  }

  deleteWatchlist(id: string): Observable<any> {
    return this.http.delete(`/api/MSCollection/deleteData/${id}`);
  }
}