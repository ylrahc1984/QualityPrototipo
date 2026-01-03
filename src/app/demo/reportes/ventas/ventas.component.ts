// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

interface Venta {
  numero: string;
  cliente: string;
  fecha: string;
  canal: string;
  moneda: string;
  total: number;
  estado: 'emitida' | 'pagada' | 'anulada';
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent {
  ventas: Venta[] = [
    { numero: 'F-0001', cliente: 'Hotel Pacifico', fecha: '2026-01-04', canal: 'Directo', moneda: 'USD', total: 125000, estado: 'pagada' },
    { numero: 'F-0002', cliente: 'Agencia Caribe', fecha: '2026-01-02', canal: 'Agencia', moneda: 'USD', total: 54000, estado: 'emitida' },
    { numero: 'F-0003', cliente: 'Travel Partners', fecha: '2026-01-01', canal: 'OTA', moneda: 'USD', total: 43000, estado: 'emitida' },
    { numero: 'F-0004', cliente: 'Corporativo Andes', fecha: '2025-12-30', canal: 'Corporate', moneda: 'USD', total: 98000, estado: 'pagada' },
    { numero: 'F-0005', cliente: 'Hotel Los Pinos', fecha: '2025-12-28', canal: 'Directo', moneda: 'USD', total: 130000, estado: 'anulada' }
  ];

  filtros = {
    buscar: '',
    estado: 'todos',
    canal: 'todos',
    desde: '',
    hasta: ''
  };

  canales = ['Directo', 'Agencia', 'OTA', 'Corporate'];

  page = 1;
  pageSize = 5;
  pageSizes = [5, 10, 20];

  filteredVentas() {
    const texto = this.filtros.buscar.trim().toLowerCase();
    const estado = this.filtros.estado;
    const canal = this.filtros.canal;
    const desde = this.filtros.desde ? new Date(this.filtros.desde) : null;
    const hasta = this.filtros.hasta ? new Date(this.filtros.hasta) : null;

    return this.ventas.filter((v) => {
      const coincideTexto =
        !texto ||
        (v.cliente || '').toLowerCase().includes(texto) ||
        (v.numero || '').toLowerCase().includes(texto);
      const coincideEstado = estado === 'todos' || v.estado === estado;
      const coincideCanal = canal === 'todos' || v.canal === canal;
      const fecha = new Date(v.fecha);
      const coincideDesde = !desde || fecha >= desde;
      const coincideHasta = !hasta || fecha <= hasta;
      return coincideTexto && coincideEstado && coincideCanal && coincideDesde && coincideHasta;
    });
  }

  pagedVentas() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredVentas().slice(start, start + this.pageSize);
  }

  totalPaginas() {
    return Math.max(1, Math.ceil(this.filteredVentas().length / this.pageSize));
  }

  totalFiltrado() {
    return this.filteredVentas().reduce((sum, v) => sum + v.total, 0);
  }

  changePage(delta: number) {
    const next = this.page + delta;
    this.page = Math.min(Math.max(next, 1), this.totalPaginas());
  }

  onPageSizeChange(size: number | string) {
    this.pageSize = Number(size) || 5;
    this.page = 1;
  }

  resetFiltros() {
    this.filtros = { buscar: '', estado: 'todos', canal: 'todos', desde: '', hasta: '' };
    this.page = 1;
  }

  resetPagina() {
    this.page = 1;
  }

  getEstadoClase(estado: Venta['estado']) {
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
    console.log('Exportar ventas', this.filteredVentas());
  }

  imprimir() {
    window.print();
  }
}
