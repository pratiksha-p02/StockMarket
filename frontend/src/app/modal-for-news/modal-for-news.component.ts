import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StockkService } from '../stockk.service';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-for-news',
  templateUrl: './modal-for-news.component.html',
  styleUrl: './modal-for-news.component.css'
})
export class ModalForNewsComponent {
  stockName: any;
  companyNews: any;
  item: any;
  
  formattedTime:any;
  constructor(public dialogRef: MatDialogRef<ModalForNewsComponent>,private stockkService: StockkService,private route: ActivatedRoute,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.item = data.item;
    
    
   }
  

  ngOnInit(): void {
    
    this.formattedTime=formatTimeFunction(this.item.datetime);
    // console.log(this.item.datetime,"DATETIME FROM MODAL FUNCITON");
    // console.log(this.item,"MODAL ITEM RECIEVED");

  }
  shareOnTwitter():void {
    const tweetMessage = encodeURIComponent(this.item.headline);
    const tweetUrl = encodeURIComponent(this.item.url);
  
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${tweetMessage}&url=${tweetUrl}`;
    // console.log("Twitter open please");
  
    window.open(twitterIntentUrl, "_blank");
  }
  shareOnFacebook() {
    const facebookShareUrl = encodeURIComponent(this.item.url);
    const facebookShareMessage = encodeURIComponent(this.item.headline);
  
    const facebookShareDialogUrl = `https://www.facebook.com/sharer/sharer.php?u=${facebookShareUrl}&quote=${facebookShareMessage}`;
  
    window.open(facebookShareDialogUrl, "_blank");
    
  }

  
  fetchCompanyNews(stockName: any) {
    this.stockkService.fetchDataForCompanyNews(stockName).subscribe(
      (jsonData) => {
        this.companyNews = jsonData;
      });
  }
  closeModal(): void {
    this.dialogRef.close();
  }
   
  

}

function formatTimeFunction(datetime: any): string {

  const date: Date = new Date(datetime * 1000);
const year: number = date.getFullYear();
const month: string = date.toLocaleString('default', { month: 'long' });
const day: string = date.getDate().toString().padStart(2, '0');

return `${month} ${day}, ${year}`;

}

