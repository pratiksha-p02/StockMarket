import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { StockkService } from '../stockk.service';
import { ModalForBuySellStocksComponent } from '../modal-for-buy-sell-stocks/modal-for-buy-sell-stocks.component';
import { ModalForSellStocksComponent } from '../modal-for-sell-stocks/modal-for-sell-stocks.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit {

  displayData: any[] = [];

  raiseYAlert = false;
  raiseGAlert = false;
  raiseRAlert = false;

  alertNameStock = '';
  totMoneyInWallet = 0;

  isLoading = true;

  constructor(
    private router: Router,
    private stockkService: StockkService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPortfolio();
  }

  // -------------------------
  // LOAD DATA
  // -------------------------
  private loadPortfolio() {
    this.isLoading = true;

    this.fetchPortfolio();
    this.fetchWallet();

    this.isLoading = false;
  }

  private fetchPortfolio() {
    this.stockkService.getDataForDisplayInPortfolioTab()
      .subscribe(data => {
        this.displayData = data ?? [];
        this.raiseYAlert = this.displayData.length === 0;
      });
  }

  private fetchWallet() {
    this.stockkService.getDataForMoneyInWallet()
      .subscribe(data => {
        this.totMoneyInWallet = data?.[0]?.totalMoneyInWallet ?? 0;
      });
  }

  // -------------------------
  // BUY
  // -------------------------
  buy(item: string, price: number) {
    const dialogRef = this.dialog.open(ModalForBuySellStocksComponent, {
      width: '450px',
      data: { item, item2: price }
    });

    this.alertNameStock = item;

    dialogRef.afterClosed().subscribe(() => {
      if (this.stockkService.getBoughtStock() === 1) {
        this.raiseGAlert = true;

        setTimeout(() => {
          this.raiseGAlert = false;
          this.refreshData();
        }, 3000);
      } else {
        this.refreshData();
      }
    });
  }

  // -------------------------
  // SELL
  // -------------------------
  sell(item: string, price: number) {
    const dialogRef = this.dialog.open(ModalForSellStocksComponent, {
      width: '450px',
      data: { item, item2: price }
    });

    this.alertNameStock = item;

    dialogRef.afterClosed().subscribe(() => {
      if (this.stockkService.getBoughtStock() === 1) {
        this.raiseRAlert = true;

        setTimeout(() => {
          this.raiseRAlert = false;
          this.refreshData();
        }, 3000);
      } else {
        this.refreshData();
      }
    });
  }

  // -------------------------
  // REFRESH
  // -------------------------
  private refreshData() {
    this.fetchPortfolio();
    this.fetchWallet();
  }

  // -------------------------
  // NAVIGATION
  // -------------------------
  directToNextComponent(symbol: string) {
    this.router.navigate(['/search', symbol]);
  }
}