import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchStockComponent } from './search-stock/search-stock.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { DisplayStockSearchComponent } from './display-stock-search/display-stock-search.component';

const routes: Routes = [
  { path: '', redirectTo: '/search/home', pathMatch: 'full'},
  {path: 'search/home', component: SearchStockComponent},
  {path: 'search/:ticker', component: DisplayStockSearchComponent},
  { path: 'portfolio', component: PortfolioComponent },
  {path: 'watchlist', component: WatchlistComponent}
];
//do this properly when set up
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const routingComponents = [SearchStockComponent,DisplayStockSearchComponent,PortfolioComponent,WatchlistComponent];