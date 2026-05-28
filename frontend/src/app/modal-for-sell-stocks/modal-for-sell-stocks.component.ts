import { AfterViewInit, Component, EventEmitter, Inject, OnInit, Output, numberAttribute } from '@angular/core';
import { StockkService } from '../stockk.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
declare var bootstrap: any;
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
  selector: 'app-modal-for-sell-stocks',
  templateUrl: './modal-for-sell-stocks.component.html',
  styleUrl: './modal-for-sell-stocks.component.css'
})
export class ModalForSellStocksComponent implements OnInit,AfterViewInit {
  item: any = '';
  apitotmoney: number = 0.0;
  item2: number = 0.0;
  mIW: number = 0.0;
  quantity: number = 0;
  totalAmountGivenStocksBought: number = 0;
  message: string = '';
  alertforlessmoney: string = '';
  showModal: boolean = true;
  companyProfileData: any;
  companyStockQuoteData: any;
  newTotalMoneyInWallet: any;
  newWalletInMoneyUpdate: any;
  enableButton:boolean=false;

  PortfolioData!: PortfolioData;
  portfolioItemPrepared!: PortfolioData;
  quantityForButton:number=0;

  @Output() modalClosed = new EventEmitter<void>();
  @Output() modalClosedMain = new EventEmitter<void>();

  ngOnInit(): void {
    this.getTotalMoneyInWalletFromServices();
    this.fetchCompanyProfileAPI(this.item);
    this.fetchDataForCompanyStockQuoteAPI(this.item);
    this.stockkService.setSoldStock(0);
  }
  constructor(public dialogRef: MatDialogRef<ModalForSellStocksComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private stockkService: StockkService) {

    this.item = data.item;//ticker name
    this.item2 = data.item2;
    this.mIW = stockkService.getWalletNumber();
    this.quantity = 0;

    this.portfolioItemPrepared = {
      symbol: '',
      sName: '',
      qty: 0,
      avgCost: 0.0,
      totCost: 0.0,
      change: 0.0,
      cp: 0.0,
      mv: 0.0,
    }
  }
  ngAfterViewInit(): void {

  }


  fetchCompanyProfileAPI(stockName: any) {
    this.stockkService.fetchDataForCompanyProfile(stockName)
      .subscribe(data => {
        this.companyProfileData = data;

      });

  }
  fetchDataForCompanyStockQuoteAPI(stockname: any) {
    this.stockkService.fetchDataForCompanyStockQuote(stockname)
      .subscribe(data => {
        this.companyStockQuoteData = data;
      });
  }

  checkQuantity() {
    this.totalAmountGivenStocksBought = this.quantity * this.item2;
    this.stockkService.getDataForDisplayInPortfolioTab().subscribe(
      data => {console.log(data,"modal for selllllll",this.item);
        data.forEach((iteminfn: { symbol: any, _id: any, qty: number, totCost: number }) => {
          if (iteminfn.symbol.toLowerCase() == this.item.toLowerCase()) {
            if (this.quantity > iteminfn.qty) {

              this.alertforlessmoney = `You can't sell stocks you dont have!`;
            }
            else if (this.quantity <1) {
              this.alertforlessmoney = `Please enter a number greater than 0`;
            }
            else if (this.quantity >iteminfn.qty) {
              this.alertforlessmoney = `Please enter a number greater than 0`;
            }
            else{
              this.enableButton=true;
            this.alertforlessmoney = ``;
            }

          }
        })
      });
    this.message = `${this.totalAmountGivenStocksBought.toFixed(2)}`;

  }
  settingNewTotalMoney(qty: number, c: number) {
    this.newTotalMoneyInWallet = { totalMoneyInWallet: (this.apitotmoney + qty * c) };

    this.newWalletInMoneyUpdate = {
      totalMoneyInWallet: this.newTotalMoneyInWallet
    };
  }

  updateTotalMoneyInWalletFromServices(documentId: string, newData: any): void {
    this.stockkService.updateDataForMoneyInWallet(documentId, newData).subscribe({
      next: (response) => {

      },
      error: (error) => {
        console.error('Error updating document:', error);
      }
    });
  }
  sell() {
    const documentId = "6601d417dc65fafc2fe40025";

    this.settingNewTotalMoney(this.quantity, this.companyStockQuoteData.c);


    this.stockkService.getDataForDisplayInPortfolioTab().subscribe(
      data => {
        var deleteAllOrNot=0;
        var itemExists:any;

        data.forEach((iteminfn: { symbol: any,_id:any,qty:number,totCost:number }) => {
          if (iteminfn.symbol.toLowerCase() == this.item.toLowerCase()) {
            if(iteminfn.qty==this.quantity){
            deleteAllOrNot=1;
          }
            itemExists=iteminfn;
          } })
            if(deleteAllOrNot==1){
              this.stockkService.deleteDataforPortfolio(itemExists._id).subscribe(response=>{
                this.updateTotalMoneyInWalletFromServices(documentId, this.newTotalMoneyInWallet);
              });

            }
          else {
            this.portfolioItemPrepared = {
              symbol: this.item,
              sName: this.companyProfileData.name,
              qty: itemExists.qty-this.quantity,
              totCost: itemExists.totCost-(this.quantity*this.companyStockQuoteData.c),
              avgCost: (itemExists.totCost-(this.quantity*this.companyStockQuoteData.c))/(itemExists.qty-this.quantity),
              change:((itemExists.totCost-(this.quantity*this.companyStockQuoteData.c))/(itemExists.qty-this.quantity))-this.companyStockQuoteData.c,
              cp: this.companyStockQuoteData.c,
              mv: (itemExists.qty-this.quantity)*this.companyStockQuoteData.c,
            };
            this.stockkService.updateDataDisplayInPortfolioTab(itemExists._id,this.portfolioItemPrepared).subscribe(
              response => {

              },
              error => {

              }
            );

          }
       

      }
    )

    this.stockkService.setSoldStock(1);
    this.dialogRef.close({ /* Your data to pass */ });
    this.modalClosed.emit();
    this.modalClosedMain.emit()

  }



  isButtonEnabled(): boolean {
    return this.enableButton;
  }
  closeModal() {
    this.dialogRef.close(); 
  }
  getTotalMoneyInWalletFromServices() {
    this.stockkService.getDataForMoneyInWallet().subscribe(data => {
      this.apitotmoney = data[0].totalMoneyInWallet;

    });
  }
}


 