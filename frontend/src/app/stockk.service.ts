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

  private stockName = '';
  private walletAmount = 0;
  private boughtStockFlag = 0;
  private soldStockFlag = 0;

  constructor(private http: HttpClient) {}

  private formatDateForApi(time: number): string {
    const timestamp = time < 10000000000 ? time * 1000 : time;
    return new Date(timestamp).toISOString().slice(0, 10);
  }

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

  setSoldStock(value: number) {
    this.soldStockFlag = value;
  }

  getSoldStock(): number {
    return this.soldStockFlag;
  }

  /* ---------------- AUTOCOMPLETE ---------------- */

  fetchDataForAutoComplete(): Observable<any> {
    return this.http.get('/stockSearchAutocompleteAPI');
  }

  /* ---------------- COMPANY DATA ---------------- */

  fetchCompanyProfile(symbol: string): Observable<any> {
    return this.http.get(`/companyProfile?userInputQuery=${encodeURIComponent(symbol)}`);
  }

  fetchDataForCompanyProfile(symbol: string): Observable<any> {
    return this.fetchCompanyProfile(symbol);
  }

  fetchCompanyQuote(symbol: string): Observable<any> {
    return this.http.get(`/stockQuote?userInputQuery=${encodeURIComponent(symbol)}`);
  }

  fetchDataForCompanyStockQuote(symbol: string): Observable<any> {
    return this.fetchCompanyQuote(symbol);
  }

  fetchCompanyPeers(symbol: string): Observable<any> {
    return this.http.get(`/companyPeers?userInputQuery=${encodeURIComponent(symbol)}`);
  }

  fetchDataForCompanyPeers(symbol: string): Observable<any> {
    return this.fetchCompanyPeers(symbol);
  }

  fetchCompanyNews(symbol: string): Observable<any> {
    return this.http.get(`/companyNews?userInputQuery=${encodeURIComponent(symbol)}`);
  }

  fetchDataForCompanyNews(symbol: string): Observable<any> {
    return this.fetchCompanyNews(symbol);
  }

  /* ---------------- STOCK CHART DATA ---------------- */

  fetchStockHistory(symbol: string, fromDate: string, toDate: string): Observable<any> {
    return this.http.get(
      `/poly?userInputQuery=${encodeURIComponent(symbol)}&fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  fetchDataFromPolyMarketClosed(time: number, symbol: string): Observable<any> {
    const date = this.formatDateForApi(time);
    return this.fetchStockHistory(symbol, date, date);
  }

  fetchChartsData(symbol: string): Observable<ChartsData> {
    return this.http.get<ChartsData>(
      `/stockQuoteForChartsTab?userInputQuery=${encodeURIComponent(symbol)}`
    );
  }

  fetchDataForChartsTab(symbol: string): Observable<ChartsData> {
    return this.fetchChartsData(symbol);
  }

  /* ---------------- INSIGHTS ---------------- */

  fetchInsiderSentiment(symbol: string): Observable<any> {
    return this.http.get(`/insiderSentiment?userInputQuery=${encodeURIComponent(symbol)}`);
  }

  fetchDataforInsiderSentiment(symbol: string): Observable<any> {
    return this.fetchInsiderSentiment(symbol);
  }

  fetchRecommendations(symbol: string): Observable<any> {
    return this.http.get(`/stockRecommendation?userInputQuery=${encodeURIComponent(symbol)}`);
  }

  fetchDataForStockRecommendation(symbol: string): Observable<any> {
    return this.fetchRecommendations(symbol);
  }

  fetchEarnings(symbol: string): Observable<any> {
    return this.http.get(`/stockEarnings?userInputQuery=${encodeURIComponent(symbol)}`);
  }

  fetchDataForStockEarnings(symbol: string): Observable<any> {
    return this.fetchEarnings(symbol);
  }

  /* ---------------- WALLET ---------------- */

  getWallet(): Observable<any> {
    return this.http.get('/api/miscCollection/getData');
  }

  getDataForMoneyInWallet(): Observable<any> {
    return this.getWallet();
  }

  updateWallet(id: string, data: any): Observable<any> {
    return this.http.put(`/api/miscCollection/updateData/${id}`, data);
  }

  updateDataForMoneyInWallet(id: string, data: any): Observable<any> {
    return this.updateWallet(id, data);
  }

  /* ---------------- PORTFOLIO ---------------- */

  getPortfolio(): Observable<any> {
    return this.http.get('/api/MSPortfolio/getData');
  }

  getDataForDisplayInPortfolioTab(): Observable<any> {
    return this.getPortfolio();
  }

  addToPortfolio(data: any): Observable<any> {
    return this.http.post('/api/MSPortfolio/postData', data);
  }

  postDataforPortfolio(data: any): Observable<any> {
    return this.addToPortfolio(data);
  }

  updatePortfolio(id: string, data: any): Observable<any> {
    return this.http.put(`/api/MSPortfolio/updateData/${id}`, data);
  }

  updateDataDisplayInPortfolioTab(id: string, data: any): Observable<any> {
    return this.updatePortfolio(id, data);
  }

  deletePortfolio(id: string): Observable<any> {
    return this.http.delete(`/api/MSPortfolio/deleteData/${id}`);
  }

  deleteDataforPortfolio(id: string): Observable<any> {
    return this.deletePortfolio(id);
  }

  /* ---------------- WATCHLIST ---------------- */

  getWatchlist(): Observable<any> {
    return this.http.get('/api/MSCollection/getData');
  }

  getDataFromMongo(): Observable<any> {
    return this.getWatchlist();
  }

  addWatchlist(data: any): Observable<any> {
    return this.http.post('/api/MSCollection/postData', data);
  }

  postDataforWatchlist(data: any): Observable<any> {
    return this.addWatchlist(data);
  }

  deleteWatchlist(id: string): Observable<any> {
    return this.http.delete(`/api/MSCollection/deleteData/${id}`);
  }

  deleteDataforWatchlist(id: string): Observable<any> {
    return this.deleteWatchlist(id);
  }
}
