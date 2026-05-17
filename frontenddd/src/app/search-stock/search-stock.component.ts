import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { Observable } from 'rxjs';
import { map, startWith, finalize } from 'rxjs/operators';

import { StockkService } from '../stockk.service';

interface StockOption {
  description: string;
  displaySymbol: string;
  typee: string;
}

@Component({
  selector: 'app-search-stock',
  templateUrl: './search-stock.component.html',
  styleUrls: ['./search-stock.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SearchStockComponent implements OnInit {

  // -----------------------
  // STATE
  // -----------------------
  formControl = new FormControl('');

  stockValueGlobal = '';
  raiseAlert = false;
  isLoading = false;

  dataa: any;

  stockSymbolArraytest: StockOption[] = [];
  filterOptionstest!: Observable<StockOption[]>;

  loader = this.loadingBar.useRef();

  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger?: MatAutocompleteTrigger;

  @ViewChild('alertContainer')
  alertContainer?: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stockService: StockkService,
    private loadingBar: LoadingBarService
  ) {
    this.stockValueGlobal = this.stockService.getstockName();
  }

  // -----------------------
  // INIT
  // -----------------------
  ngOnInit(): void {

    // route sync
    this.route.params.subscribe(params => {
      const ticker = params['ticker'];
      if (ticker) {
        this.stockValueGlobal = ticker;
        this.formControl.setValue(ticker, { emitEvent: false });
      }
    });

    // service sync (initial value)
    const saved = this.stockService.getstockName();
    if (saved) {
      this.formControl.setValue(saved, { emitEvent: false });
    }

    this.loadAutoCompleteData();

    this.filterOptionstest = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterStocks(value || ''))
    );
  }

  // -----------------------
  // API LOAD
  // -----------------------
  private loadAutoCompleteData() {
    this.isLoading = true;

    this.stockService.fetchDataForAutoComplete()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(jsonData => {

        this.dataa = jsonData;

        if (this.dataa) {
          this.stockSymbolArraytest = Object.values(this.dataa).map((item: any) => ({
            description: item.description,
            displaySymbol: item.symbol,
            typee: item.type
          }));
        }
      });
  }

  // -----------------------
  // FILTER LOGIC
  // -----------------------
  private filterStocks(value: string): StockOption[] {
    const searchValue = value.toUpperCase().trim();

    const filtered = this.stockSymbolArraytest.filter(option =>
      option.displaySymbol.startsWith(searchValue) &&
      !option.displaySymbol.includes('.') &&
      option.typee === 'Common Stock'
    );

    return filtered.sort((a, b) =>
      a.displaySymbol.localeCompare(b.displaySymbol)
    );
  }

  // -----------------------
  // INPUT HANDLER
  // -----------------------
  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    this.isLoading = true;

    this.stockService.fetchDataForCompanyProfile(inputValue)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(jsonData => {

        const isEmpty =
          !jsonData ||
          (Object.keys(jsonData).length === 0 &&
           jsonData.constructor === Object);

        if (isEmpty && inputValue.length > 1) {
          this.raiseAlert = true;

          setTimeout(() => {
            this.raiseAlert = false;
          }, 4000);
        } else {
          this.raiseAlert = false;
        }
      });
  }

  // -----------------------
  // NAVIGATION (single source of truth)
  // -----------------------
  private navigateToSearch(value: string) {
    if (!value) return;

    this.stockService.setStockName(value);
    this.router.navigate(['/search', value]);
  }

  showOptions(): void {
    this.autocompleteTrigger?.openPanel();

    const value = this.formControl.value || '';
    this.navigateToSearch(value);
  }

  directToNextComponentClick(): void {
    const value = this.formControl.value || '';
    this.navigateToSearch(value);
  }

  onSubmit(): void {
    const value = this.stockService.getstockName();
    this.navigateToSearch(value);
  }

  // -----------------------
  // CLEAR
  // -----------------------
  clearValue(): void {
    this.formControl.reset('');
    this.stockService.setStockName('');
    this.router.navigate(['']);
  }

  // -----------------------
  // UTIL
  // -----------------------
  updateValue(newValue: string): void {
    this.stockService.setStockName(newValue);
  }
}