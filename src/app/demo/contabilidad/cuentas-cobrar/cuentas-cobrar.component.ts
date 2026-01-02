// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-cuentas-cobrar',
  imports: [CommonModule, SharedModule],
  templateUrl: './cuentas-cobrar.component.html',
  styleUrls: ['./cuentas-cobrar.component.scss']
})
export class CuentasCobrarComponent {
  cuentas = [
    { cliente: 'Juan Pérez', monto: 25000, fecha: '2025-12-25', estado: 'pendiente' },
    { cliente: 'María González', monto: 75000, fecha: '2025-12-26', estado: 'pagada' }
  ];

  getTotal() {
    return this.cuentas.reduce((sum, c) => sum + c.monto, 0).toLocaleString();
  }
}