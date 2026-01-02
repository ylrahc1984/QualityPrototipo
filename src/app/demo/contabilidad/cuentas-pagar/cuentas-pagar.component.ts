// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-cuentas-pagar',
  imports: [CommonModule, SharedModule],
  templateUrl: './cuentas-pagar.component.html',
  styleUrls: ['./cuentas-pagar.component.scss']
})
export class CuentasPagarComponent {
  cuentas = [
    { suplidor: 'Transportes Costa Rica', monto: 15000, fecha: '2025-12-25', estado: 'pendiente' },
    { suplidor: 'Hoteles San José', monto: 30000, fecha: '2025-12-26', estado: 'pagada' }
  ];

  getTotal() {
    return this.cuentas.reduce((sum, c) => sum + c.monto, 0).toLocaleString();
  }
}