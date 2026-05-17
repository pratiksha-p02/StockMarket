import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsforSearchComponent } from './tabsfor-search.component';

describe('TabsforSearchComponent', () => {
  let component: TabsforSearchComponent;
  let fixture: ComponentFixture<TabsforSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsforSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabsforSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
