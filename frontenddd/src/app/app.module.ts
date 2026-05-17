// CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA
import { NgModule,CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient } from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderrComponent } from './headerr/headerr.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FooterrComponent } from './footerr/footerr.component';
import { SearchStockComponent } from './search-stock/search-stock.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DisplayStockSearchComponent } from './display-stock-search/display-stock-search.component';
import { StockkService } from './stockk.service';
import { from } from 'rxjs';
import { TabsforSearchComponent } from './tabsfor-search/tabsfor-search.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule } from 'angular2-highcharts';
import * as highcharts from 'highcharts';
import { ModalForNewsComponent } from './modal-for-news/modal-for-news.component';
import { MatDialogRef,MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalForBuySellStocksComponent } from './modal-for-buy-sell-stocks/modal-for-buy-sell-stocks.component';
import { ModalForSellStocksComponent } from './modal-for-sell-stocks/modal-for-sell-stocks.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';





@NgModule({
  exports: [


  ],
  declarations: [
    AppComponent,
    HeaderrComponent,
    FooterrComponent,
    SearchStockComponent,
    PortfolioComponent,
    WatchlistComponent,
    DisplayStockSearchComponent,
    TabsforSearchComponent,
    ModalForNewsComponent,
    ModalForBuySellStocksComponent,
    ModalForSellStocksComponent,
    

  ],
  imports: [

    MatDialogModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    HighchartsChartModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTabsModule,
    LoadingBarModule,
    NgbModule,
    FormsModule,
    MatSlideToggleModule,
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    RouterModule

  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    StockkService,
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
