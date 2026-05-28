import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StockkService } from '../stockk.service';

@Component({
  selector: 'app-headerr',
  templateUrl: './headerr.component.html',
  styleUrl: './headerr.component.css'
})
export class HeaderrComponent {

  activeTab: 'search' | 'watchlist' | 'portfolio' = 'search';

  constructor(
    private router: Router,
    private stockkService: StockkService
  ) {}

  navigateToSearch() {
    this.activeTab = 'search';

    const stockName = this.stockkService.getstockName();

    if (stockName && stockName.trim() !== '') {
      this.router.navigate(['/search', stockName]);
    } else {
      this.router.navigate(['']);
    }
  }

  navigateToWaitlist() {
    this.activeTab = 'watchlist';
    this.router.navigate(['/watchlist']);
  }

  navigateToPortfolio() {
    this.activeTab = 'portfolio';
    this.router.navigate(['/portfolio']);
  }
}