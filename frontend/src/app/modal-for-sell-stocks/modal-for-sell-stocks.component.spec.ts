import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalForSellStocksComponent } from './modal-for-sell-stocks.component';

describe('ModalForSellStocksComponent', () => {
  let component: ModalForSellStocksComponent;
  let fixture: ComponentFixture<ModalForSellStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalForSellStocksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalForSellStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
