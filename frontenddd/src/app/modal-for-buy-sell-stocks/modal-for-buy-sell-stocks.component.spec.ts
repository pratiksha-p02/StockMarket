import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalForBuySellStocksComponent } from './modal-for-buy-sell-stocks.component';

describe('ModalForBuySellStocksComponent', () => {
  let component: ModalForBuySellStocksComponent;
  let fixture: ComponentFixture<ModalForBuySellStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalForBuySellStocksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalForBuySellStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
