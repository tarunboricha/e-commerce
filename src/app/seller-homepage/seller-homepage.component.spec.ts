import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerHomepageComponent } from './seller-homepage.component';

describe('SellerHomepageComponent', () => {
  let component: SellerHomepageComponent;
  let fixture: ComponentFixture<SellerHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerHomepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
