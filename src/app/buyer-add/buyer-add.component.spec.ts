import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerAddComponent } from './buyer-add.component';

describe('BuyerAddComponent', () => {
  let component: BuyerAddComponent;
  let fixture: ComponentFixture<BuyerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyerAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
