// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

type EstadoReserva = 'confirmada' | 'pendiente' | 'cancelada';

interface ReservaReporte {
  codigo: string;
  fecha: string;
  cliente: string;
  servicio: string;
  origen: string;
  destino: string;
  hora: string;
  pax: number;
  agencia: string;
  estado: EstadoReserva;
  total: number;
}

@Component({
  selector: 'app-reservas-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent {
  reservas: ReservaReporte[] = [
    { codigo: 'RES-1001', fecha: '2026-01-04', cliente: 'Quality Travel', servicio: 'Tour Monteverde', origen: 'San Jose', destino: 'Monteverde', hora: '07:30', pax: 4, agencia: 'Allan Paniagua', estado: 'confirmada', total: 520 },
    { codigo: 'RES-1002', fecha: '2026-01-03', cliente: 'Agencia Caribe', servicio: 'Transfer Privado', origen: 'SJO', destino: 'Los Pinos', hora: '10:00', pax: 2, agencia: 'Agencia Caribe', estado: 'pendiente', total: 310 },
    { codigo: 'RES-1003', fecha: '2026-01-02', cliente: 'Brenda Jones', servicio: 'Tour Nocturno', origen: 'Lodge Jaguarundi', destino: 'Night Hike', hora: '17:45', pax: 2, agencia: 'Allan Paniagua', estado: 'confirmada', total: 240 },
    { codigo: 'RES-1004', fecha: '2025-12-30', cliente: 'Trapp Family', servicio: 'Transfer Colectivo', origen: 'Courtyard', destino: 'Trapp Family', hora: '14:00', pax: 2, agencia: 'Trapp Family', estado: 'cancelada', total: 0 },
    { codigo: 'RES-1005', fecha: '2025-12-28', cliente: 'Stephen Campbell', servicio: 'Privado Normal', origen: 'Marriott Hacienda', destino: 'Los Pinos', hora: '09:00', pax: 2, agencia: 'Los Pinos', estado: 'confirmada', total: 179 }
  ];

  filtros = {
    buscar: '',
    estado: 'todos',
    agencia: 'todos',
    desde: '',
    hasta: ''
  };

  agencias = ['Allan Paniagua', 'Agencia Caribe', 'Trapp Family', 'Los Pinos'];

  page = 1;
  pageSize = 5;
  pageSizes = [5, 10, 20];

  filteredReservas() {
    const texto = this.filtros.buscar.trim().toLowerCase();
    const estado = this.filtros.estado;
    const agencia = this.filtros.agencia;
    const desde = this.filtros.desde ? new Date(this.filtros.desde) : null;
    const hasta = this.filtros.hasta ? new Date(this.filtros.hasta) : null;

    return this.reservas.filter((r) => {
      const coincideTexto =
        !texto ||
        (r.codigo || '').toLowerCase().includes(texto) ||
        (r.cliente || '').toLowerCase().includes(texto) ||
        (r.servicio || '').toLowerCase().includes(texto);
      const coincideEstado = estado === 'todos' || r.estado === estado;
      const coincideAgencia = agencia === 'todos' || r.agencia === agencia;
      const fecha = new Date(r.fecha);
      const coincideDesde = !desde || fecha >= desde;
      const coincideHasta = !hasta || fecha <= hasta;
      return coincideTexto && coincideEstado && coincideAgencia && coincideDesde && coincideHasta;
    });
  }

  pagedReservas() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredReservas().slice(start, start + this.pageSize);
  }

  totalPaginas() {
    return Math.max(1, Math.ceil(this.filteredReservas().length / this.pageSize));
  }

  totalFiltrado() {
    return this.filteredReservas().reduce((sum, r) => sum + r.total, 0);
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
    this.filtros = { buscar: '', estado: 'todos', agencia: 'todos', desde: '', hasta: '' };
    this.page = 1;
  }

  resetPagina() {
    this.page = 1;
  }

  getEstadoClase(estado: EstadoReserva) {
    switch (estado) {
      case 'confirmada':
        return 'estado-confirmada';
      case 'cancelada':
        return 'estado-cancelada';
      default:
        return 'estado-pendiente';
    }
  }

  exportarExcel() {
    console.log('Exportar reservas', this.filteredReservas());
  }

  imprimir() {
    window.print();
  }
}
