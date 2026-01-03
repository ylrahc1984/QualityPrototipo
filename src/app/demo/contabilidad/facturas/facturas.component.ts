// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

type EstadoFactura = 'emitida' | 'pagada' | 'anulada';

interface Factura {
  numero: string;
  cliente: string;
  monto: number;
  fecha: string;
  estado: EstadoFactura;
}

@Component({
  selector: 'app-facturas',
  imports: [CommonModule, SharedModule, FormsModule, RouterModule],
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent {
  facturas: Factura[] = [
    { numero: '001-001-0000001', cliente: 'Juan Perez', monto: 25000, fecha: '2025-12-25', estado: 'emitida' },
    { numero: '001-001-0000002', cliente: 'Maria Gonzalez', monto: 75000, fecha: '2025-12-26', estado: 'pagada' },
    { numero: '001-001-0000003', cliente: 'Hotel Los Pinos', monto: 130000, fecha: '2026-01-03', estado: 'emitida' },
    { numero: '001-001-0000004', cliente: 'Agencia Caribe', monto: 54000, fecha: '2026-01-01', estado: 'anulada' },
    { numero: '001-001-0000005', cliente: 'Corporativo Andes', monto: 96000, fecha: '2025-12-30', estado: 'pagada' },
    { numero: '001-001-0000006', cliente: 'Travel Partners', monto: 43000, fecha: '2025-12-28', estado: 'emitida' }
  ];

  filtros = {
    buscar: '',
    estado: 'todos',
    desde: '',
    hasta: ''
  };

  page = 1;
  pageSize = 5;
  pageSizes = [5, 10, 20];

  filteredFacturas() {
    const texto = this.filtros.buscar.trim().toLowerCase();
    const desde = this.filtros.desde ? new Date(this.filtros.desde) : null;
    const hasta = this.filtros.hasta ? new Date(this.filtros.hasta) : null;

    return this.facturas.filter((f) => {
      const coincideTexto =
        !texto ||
        (f.cliente || '').toLowerCase().includes(texto) ||
        (f.numero || '').toLowerCase().includes(texto);
      const coincideEstado = this.filtros.estado === 'todos' || f.estado === this.filtros.estado;
      const fechaFactura = new Date(f.fecha);
      const coincideDesde = !desde || fechaFactura >= desde;
      const coincideHasta = !hasta || fechaFactura <= hasta;
      return coincideTexto && coincideEstado && coincideDesde && coincideHasta;
    });
  }

  pagedFacturas() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredFacturas().slice(start, start + this.pageSize);
  }

  totalPaginas() {
    return Math.max(1, Math.ceil(this.filteredFacturas().length / this.pageSize));
  }

  getTotalFiltrado() {
    return this.filteredFacturas().reduce((sum, f) => sum + f.monto, 0);
  }

  changePage(delta: number) {
    const next = this.page + delta;
    const max = this.totalPaginas();
    this.page = Math.min(Math.max(next, 1), max);
  }

  onPageSizeChange(size: number | string) {
    this.pageSize = Number(size) || 5;
    this.page = 1;
  }

  resetFiltros() {
    this.filtros = { buscar: '', estado: 'todos', desde: '', hasta: '' };
    this.page = 1;
  }

  resetPagina() {
    this.page = 1;
  }

  getEstadoClase(estado: EstadoFactura) {
    switch (estado) {
      case 'pagada':
        return 'estado-pagada';
      case 'anulada':
        return 'estado-anulada';
      default:
        return 'estado-emitida';
    }
  }

  exportarExcel() {
    console.log('Exportar facturas a Excel', this.filteredFacturas());
  }

  imprimir() {
    window.print();
  }
}
