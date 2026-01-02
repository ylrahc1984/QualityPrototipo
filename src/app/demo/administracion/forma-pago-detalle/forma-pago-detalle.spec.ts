import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaPagoDetalle } from './forma-pago-detalle';

describe('FormaPagoDetalle', () => {
  let component: FormaPagoDetalle;
  let fixture: ComponentFixture<FormaPagoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormaPagoDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormaPagoDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
