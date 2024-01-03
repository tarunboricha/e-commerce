import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOfProductComponent } from './details-of-product.component';

describe('DetailsOfProductComponent', () => {
  let component: DetailsOfProductComponent;
  let fixture: ComponentFixture<DetailsOfProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsOfProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsOfProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
