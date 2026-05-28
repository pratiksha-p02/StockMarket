import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Subject, interval, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { StockkService } from '../stockk.service';
import { ModalForBuySellStocksComponent } from '../modal-for-buy-sell-stocks/modal-for-buy-sell-stocks.component';
import { ModalForSellStocksComponent } from '../modal-for-sell-stocks/modal-for-sell-stocks.component';

declare var bootstrap: any;

export interface WatchlistItem {
  symbol: string;
  name: string;
  c: number;
  p: number;
  dp: number;
  isFav: boolean;
}

@Component({
  selector: 'app-display-stock-search',
  templateUrl: './display-stock-search.component.html',
  styleUrl: './display-stock-search.component.css'
})
export class DisplayStockSearchComponent implements OnInit, AfterViewInit, OnDestroy {

  private destroy$ = new Subject<void>();

  @ViewChild('heyclearDiv') heyclearDiv?: ElementRef;

  // alerts (UNCHANGED - used in template)
  raiseGStar = false;
  raiseRStar = false;
  raiseGStock = false;
  raiseRStock = false;

  // state
  stockName: string = '';
  companyProfileData: any;
  companyStockQuoteData: any;

  openMarket = false;
  isLoading = true;

  IsFavTrueOrFalse = false;
  noPortfolioItems = 0;

  formattedDateTimeM = '';
  formattedDateTimeN = '';

  watchlistdataa: WatchlistItem = {
    symbol: '',
    name: '',
    c: 0,
    p: 0,
    dp: 0,
    isFav: false
  };

  constructor(
    private route: ActivatedRoute,
    private stockkService: StockkService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  // -------------------------
  // LIFECYCLE
  // -------------------------
  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.stockName = params['ticker'];

        this.resetState();
        this.initLoad();
        this.startPolling();
      });
  }

  ngAfterViewInit(): void {
    const el = document.getElementById('myModal');
    if (el && (window as any).bootstrap?.Modal) {
      new (window as any).bootstrap.Modal(el);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // -------------------------
  // INIT
  // -------------------------
  private resetState() {
    this.isLoading = true;
    this.IsFavTrueOrFalse = false;
    this.noPortfolioItems = 0;
  }

  private initLoad() {
    this.fetchCompanyProfileAPI(this.stockName);
    this.fetchDataForCompanyStockQuoteAPI(this.stockName);
    this.fetchDataFromMongo();
    this.isFavOrNotCheckInMongoDB();
    this.checkPortfolioItems();
  }

  private startPolling() {
    interval(15000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.openMarket) {
          this.fetchDataForCompanyStockQuoteAPI(this.stockName);
          this.fetchDataFromMongo();
          this.isFavOrNotCheckInMongoDB();
          this.checkPortfolioItems();
        }
      });
  }

  // -------------------------
  // API CALLS (UNCHANGED NAMES)
  // -------------------------
  fetchCompanyProfileAPI(stockName: any) {
    this.stockkService.fetchDataForCompanyProfile(stockName)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.companyProfileData = data;
      });
  }

  fetchDataFromMongo() {
    this.stockkService.getDataFromMongo()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  fetchDataForCompanyStockQuoteAPI(stockname: any) {
    this.stockkService.fetchDataForCompanyStockQuote(stockname)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.companyStockQuoteData = data;

        this.updateMarketStatus();
        this.updateTimeFormats();

        this.isLoading = false;
      });
  }

  // -------------------------
  // MARKET
  // -------------------------
  private updateMarketStatus() {
    const now = Date.now();
    const last = this.companyStockQuoteData.t * 1000;

    this.openMarket = (now - last) < 5 * 60 * 1000;
  }

  private updateTimeFormats() {
    const d = new Date(this.companyStockQuoteData.t * 1000);

    this.formattedDateTimeM = d.toISOString().replace('T', ' ').slice(0, 19);

    this.formattedDateTimeN = new Date()
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19);
  }

  // -------------------------
  // WATCHLIST
  // -------------------------
  isFavOrNotCheckInMongoDB() {
    this.stockkService.getDataFromMongo()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const match = data.find(
          (s: any) =>
            s.symbol?.toLowerCase() === this.stockName.toLowerCase()
        );

        this.IsFavTrueOrFalse = !!match;
      });
  }

  isNotFavvvYet() {
    this.watchlistdataa = {
      symbol: this.stockName,
      name: this.companyProfileData?.name,
      c: this.companyStockQuoteData?.c,
      p: this.companyStockQuoteData?.d,
      dp: this.companyStockQuoteData?.dp,
      isFav: true
    };

    this.stockkService.postDataforWatchlist(this.watchlistdataa)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.raiseGStar = true;

        setTimeout(() => this.raiseGStar = false, 3000);

        this.isFavOrNotCheckInMongoDB();
      });
  }

  async isAlreadyFavvv() {
    this.stockkService.getDataFromMongo()
      .pipe(
        switchMap(data => {
          const item = data.find(
            (s: any) =>
              s.symbol?.toLowerCase() === this.stockName.toLowerCase()
          );

          return item
            ? this.stockkService.deleteDataforWatchlist(item._id)
            : of(null);
        })
      )
      .subscribe(() => {
        this.raiseRStar = true;
        setTimeout(() => this.raiseRStar = false, 3000);

        this.IsFavTrueOrFalse = false;
      });
  }

  // -------------------------
  // PORTFOLIO
  // -------------------------
  checkPortfolioItems() {
    this.stockkService.getDataForDisplayInPortfolioTab()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.noPortfolioItems = data.some(
          (i: any) =>
            i.symbol?.toLowerCase() === this.stockName.toLowerCase()
        )
          ? 1
          : 0;
      });
  }

  // -------------------------
  // MODALS (UNCHANGED NAMES)
  // -------------------------
  openBUYSELLModal(item: string, item2: number) {
    const dialogRef = this.dialog.open(ModalForBuySellStocksComponent, {
      width: '450px',
      data: { item, item2 }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.raiseGStock = true;
      this.checkPortfolioItems();

      setTimeout(() => this.raiseGStock = false, 3000);
    });
  }

  openSELLModal(item: string, item2: number) {
    const dialogRef = this.dialog.open(ModalForSellStocksComponent, {
      width: '450px',
      data: { item, item2 }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.raiseRStock = true;
      this.checkPortfolioItems();

      setTimeout(() => this.raiseRStock = false, 3000);
    });
  }

  // -------------------------
  // UI HELPERS
  // -------------------------
  refreshView() {
    this.cdr.detectChanges();
  }
}