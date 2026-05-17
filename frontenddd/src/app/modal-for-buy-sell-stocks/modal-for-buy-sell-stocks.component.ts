import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StockkService } from '../stockk.service';

export interface PortfolioData {
  symbol: string;
  sName: string;
  qty: number;
  avgCost: number;
  totCost: number;
  change: number;
  cp: number;
  mv: number;
}

@Component({
  selector: 'app-modal-for-buy-sell-stocks',
  templateUrl: './modal-for-buy-sell-stocks.component.html',
  styleUrl: './modal-for-buy-sell-stocks.component.css'
})
export class ModalForBuySellStocksComponent implements OnInit {

  @Output() detailsEmitter = new EventEmitter<any>();
  @Output() closeModalportfolio = new EventEmitter<void>();

  // inputs
  item = '';
  item2 = 0;

  // state
  quantity = 0;
  apitotmoney = 0;

  message = '';
  alertforlessmoney = '';

  totalAmountGivenStocksBought = 0;

  companyProfileData: any;
  companyStockQuoteData: any;

  portfolioItemPrepared!: PortfolioData;

  constructor(
    public dialogRef: MatDialogRef<ModalForBuySellStocksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stockkService: StockkService
  ) {
    this.item = data.item;
    this.item2 = data.item2;

    this.portfolioItemPrepared = {
      symbol: '',
      sName: '',
      qty: 0,
      avgCost: 0,
      totCost: 0,
      change: 0,
      cp: 0,
      mv: 0
    };
  }

  // -------------------------
  // INIT
  // -------------------------
  ngOnInit(): void {
    this.stockkService.setBoughtStock(0);

    this.getTotalMoneyInWalletFromServices();
    this.fetchCompanyProfileAPI(this.item);
    this.fetchDataForCompanyStockQuoteAPI(this.item);
  }

  // -------------------------
  // API
  // -------------------------
  fetchCompanyProfileAPI(stockName: string) {
    this.stockkService.fetchDataForCompanyProfile(stockName)
      .subscribe(data => this.companyProfileData = data);
  }

  fetchDataForCompanyStockQuoteAPI(stockName: string) {
    this.stockkService.fetchDataForCompanyStockQuote(stockName)
      .subscribe(data => this.companyStockQuoteData = data);
  }

  // -------------------------
  // UI CALCULATIONS
  // -------------------------
  checkQuantity() {
    const price = this.companyStockQuoteData?.c ?? this.item2;

    this.totalAmountGivenStocksBought = this.quantity * price;
    this.message = this.totalAmountGivenStocksBought.toFixed(2);

    if (this.totalAmountGivenStocksBought > this.apitotmoney) {
      this.alertforlessmoney = 'Not enough money in the Wallet!';
    } else {
      this.alertforlessmoney = '';
    }
  }

  isButtonEnabled(): boolean {
    const price = this.companyStockQuoteData?.c ?? this.item2;
    return this.quantity > 0 && this.quantity * price <= this.apitotmoney;
  }

  // -------------------------
  // BUY LOGIC
  // -------------------------
  buy() {
    const documentId = '6601d417dc65fafc2fe40025';
    const price = this.companyStockQuoteData.c;

    const totalCost = this.quantity * price;

    this.updateWallet(documentId, totalCost);
    this.updatePortfolio(price);

    this.stockkService.setBoughtStock(1);

    this.detailsEmitter.emit('b');

    this.dialogRef.close();
    this.closeModalportfolio.emit();
  }

  // -------------------------
  // WALLET
  // -------------------------
  private updateWallet(documentId: string, totalCost: number) {
    const newWallet = {
      totalMoneyInWallet: this.apitotmoney - totalCost
    };

    this.stockkService.updateDataForMoneyInWallet(documentId, newWallet)
      .subscribe();
  }

  getTotalMoneyInWalletFromServices() {
    this.stockkService.getDataForMoneyInWallet()
      .subscribe(data => {
        this.apitotmoney = data?.[0]?.totalMoneyInWallet ?? 0;
      });
  }

  // -------------------------
  // PORTFOLIO
  // -------------------------
  private updatePortfolio(price: number) {
    this.stockkService.getDataForDisplayInPortfolioTab()
      .subscribe(data => {

        const existing = data.find(
          (i: any) => i.symbol?.toLowerCase() === this.item.toLowerCase()
        );

        if (existing) {
          this.updateExistingPortfolio(existing, price);
        } else {
          this.createNewPortfolio(price);
        }
      });
  }

  private updateExistingPortfolio(existing: any, price: number) {
    const newQty = existing.qty + this.quantity;
    const newTotCost = existing.totCost + this.quantity * price;

    const updated: PortfolioData = {
      symbol: this.item,
      sName: this.companyProfileData.name,
      qty: newQty,
      totCost: newTotCost,
      avgCost: newTotCost / newQty,
      change: (newTotCost / newQty) - price,
      cp: price,
      mv: newQty * price
    };

    this.stockkService.updateDataDisplayInPortfolioTab(existing._id, updated)
      .subscribe();
  }

  private createNewPortfolio(price: number) {
    const newEntry: PortfolioData = {
      symbol: this.item,
      sName: this.companyProfileData.name,
      qty: this.quantity,
      totCost: this.quantity * price,
      avgCost: price,
      change: 0,
      cp: price,
      mv: this.quantity * price
    };

    this.stockkService.postDataforPortfolio(newEntry)
      .subscribe();
  }

  // -------------------------
  // CLOSE
  // -------------------------
  closeModal() {
    this.dialogRef.close();
  }

  // -------------------------
  // UNUSED BUT KEPT SAFE (if used elsewhere)
  // -------------------------
  updatePortfolioTabDetails(documentId: string, newData: any): void {
    this.stockkService.updateDataDisplayInPortfolioTab(documentId, newData)
      .subscribe();
  }
}