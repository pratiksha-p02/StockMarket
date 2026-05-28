import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayStockSearchComponent } from './display-stock-search.component';

describe('DisplayStockSearchComponent', () => {
  let component: DisplayStockSearchComponent;
  let fixture: ComponentFixture<DisplayStockSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayStockSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayStockSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
