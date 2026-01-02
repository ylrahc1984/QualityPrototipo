// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-facturas',
  imports: [CommonModule, SharedModule],
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent {
  facturas = [
    { numero: '001-001-0000001', cliente: 'Juan Pérez', monto: 25000, fecha: '2025-12-25', estado: 'emitida' },
    { numero: '001-001-0000002', cliente: 'María González', monto: 75000, fecha: '2025-12-26', estado: 'pagada' }
  ];
}