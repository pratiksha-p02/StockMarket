import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalForNewsComponent } from './modal-for-news.component';

describe('ModalForNewsComponent', () => {
  let component: ModalForNewsComponent;
  let fixture: ComponentFixture<ModalForNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalForNewsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalForNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
