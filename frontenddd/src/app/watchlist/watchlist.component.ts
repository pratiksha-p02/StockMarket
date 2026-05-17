import { Component, OnInit } from '@angular/core';
import { StockkService } from '../stockk.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit {
  watchlistapidata:any;
  isLoading: boolean = false;

  watchlistlist:any;
  constructor(private stockkService: StockkService,private router: Router,) { }
  ngOnInit(): void {
    this.fetchDataFromMongo() ;
  }
  nameToIdMap: { [key: string]: string } = {};

  fetchDataFromMongo() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); 
    this.stockkService.getDataFromMongo().subscribe(
  

      data => { this.watchlistapidata=data;
        this.watchlistapidata.forEach(
          // (
          console.log(this.watchlistapidata._id)
          // item: { name: string | number; _id: string; }) => this.nameToIdMap[item.name] = item._id
          );
        // console.log(this.nameToIdMap['aapl']);
        // console.log('Data from MongoDB FROKMWATCHLIST:===============================================');
        // Handle the data as needed
        // console.log(data[0].c);
        console.log("reached");
  this.isLoading = false;

      },
      error => {
        console.error('Error fetching data from MongoDB:', error);
  this.isLoading = false;

        // Handle the error
      }
    );
    // this.isLoading = false;

  }


  deleteDataFromMongo(id: string) {
    // this.fetchDataFromMongo();
    // const itemId = this.nameToIdMap[name];
    console.log( 'with ID:', id);
    //subscribet to deletedata
    this.stockkService.deleteDataforWatchlist(id).subscribe(() => {
      console.log('Item deleted successfully');
      this.fetchDataFromMongo();
     
    },(error) => {
      console.error('Error deleting item:', error);
      // Optionally, provide feedback to the user about the deletion failure
    });
    

  }


  directToNextComponentClick(itemmm:string){
    console.log("entered function watchlist componetn direct to nextxs");
    this.router.navigate(['/search', itemmm]);


  }
}
