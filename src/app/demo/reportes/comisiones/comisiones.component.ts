// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

interface Comision {
  boleta: number;
  fecha: string;
  tipoServicio: string;
  horaPickUp: string;
  pax: number;
  cliente: string;
  origen: string;
  destino: string;
  agencia: string;
  costoRack: number;
  neto: number;
  comision: number;
  estado: 'pendiente' | 'pagada' | 'retenida';
}

@Component({
  selector: 'app-comisiones',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './comisiones.component.html',
  styleUrls: ['./comisiones.component.scss']
})
export class ComisionesComponent {
  comisiones: Comision[] = [
    { boleta: 25684, fecha: '2025-12-13', tipoServicio: 'TOUR EN MONTEVERDE', horaPickUp: '17:45', pax: 2, cliente: 'Mazie Arondizza', origen: 'JAGUARUNDI', destino: 'NIGHT HIKE', agencia: 'Allan Paniagua', costoRack: 162, neto: 140, comision: 22, estado: 'pagada' },
    { boleta: 25691, fecha: '2025-12-08', tipoServicio: 'COLECTIVO', horaPickUp: '08:10', pax: 2, cliente: 'Malin Isacsson', origen: 'CABANAS LA PRADERA', destino: 'HOTEL PLAYA', agencia: 'CABANAS LA', costoRack: 120, neto: 100, comision: 20, estado: 'pagada' },
    { boleta: 25788, fecha: '2025-12-15', tipoServicio: 'COLECTIVO', horaPickUp: '14:00', pax: 2, cliente: 'Brenda Jones', origen: 'COURTYARD BY', destino: 'TRAPP FAMILY', agencia: 'Trapp Family', costoRack: 120, neto: 100, comision: 20, estado: 'pagada' },
    { boleta: 25804, fecha: '2025-12-15', tipoServicio: 'TOUR EN MONTEVERDE', horaPickUp: '17:45', pax: 2, cliente: 'Tom Bruulsma', origen: 'JAGUARUNDI', destino: 'NIGHT HIKE', agencia: 'Allan Paniagua', costoRack: 176, neto: 140, comision: 36, estado: 'pagada' },
    { boleta: 25846, fecha: '2025-12-15', tipoServicio: 'TOUR EN MONTEVERDE', horaPickUp: '17:50', pax: 5, cliente: 'Ana Arce', origen: 'JAGUARUNDI LODGE', destino: 'NIGHT TOUR', agencia: 'Allan Paniagua', costoRack: 440, neto: 310, comision: 130, estado: 'pagada' },
    { boleta: 25867, fecha: '2025-12-11', tipoServicio: 'PRIVADO NORMAL', horaPickUp: '14:00', pax: 2, cliente: 'Stephen Campbell', origen: 'MARRIOTT HACIENDA', destino: 'LOS PINOS', agencia: 'LOS PINOS', costoRack: 200, neto: 179, comision: 21, estado: 'pagada' }
  ];

  filtros = {
    buscar: '',
    estado: 'todos',
    agencia: 'todos',
    desde: '',
    hasta: ''
  };

  agencias = ['Allan Paniagua', 'Trapp Family', 'CABANAS LA', 'LOS PINOS'];

  infoEmpresa = {
    nombre: 'QUALITY TRAVEL SERVICES',
    ubicacion: 'COSTA RICA',
    cedula: 'Cedula Juridica',
    telefono: '2645-6263',
    fax: '2645-7246'
  };

  today = new Date();

  page = 1;
  pageSize = 5;
  pageSizes = [5, 10, 20];

  filteredComisiones() {
    const texto = this.filtros.buscar.trim().toLowerCase();
    const estado = this.filtros.estado;
    const agencia = this.filtros.agencia;
    const desde = this.filtros.desde ? new Date(this.filtros.desde) : null;
    const hasta = this.filtros.hasta ? new Date(this.filtros.hasta) : null;

    return this.comisiones.filter((c) => {
      const coincideTexto =
        !texto ||
        (c.agencia || '').toLowerCase().includes(texto) ||
        (c.cliente || '').toLowerCase().includes(texto) ||
        (String(c.boleta) || '').toLowerCase().includes(texto) ||
        (c.tipoServicio || '').toLowerCase().includes(texto);
      const coincideEstado = estado === 'todos' || c.estado === estado;
      const coincideAgencia = agencia === 'todos' || c.agencia.toLowerCase() === agencia.toLowerCase();
      const fecha = new Date(c.fecha);
      const coincideDesde = !desde || fecha >= desde;
      const coincideHasta = !hasta || fecha <= hasta;
      return coincideTexto && coincideEstado && coincideAgencia && coincideDesde && coincideHasta;
    });
  }

  pagedComisiones() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredComisiones().slice(start, start + this.pageSize);
  }

  totalPaginas() {
    return Math.max(1, Math.ceil(this.filteredComisiones().length / this.pageSize));
  }

  totalBase() {
    return this.filteredComisiones().reduce((sum, c) => sum + c.costoRack, 0);
  }

  totalMonto() {
    return this.filteredComisiones().reduce((sum, c) => sum + c.comision, 0);
  }

  totalNeto() {
    return this.filteredComisiones().reduce((sum, c) => sum + c.neto, 0);
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

  getEstadoClase(estado: Comision['estado']) {
    switch (estado) {
      case 'pagada':
        return 'estado-pagada';
      case 'retenida':
        return 'estado-retenida';
      default:
        return 'estado-pendiente';
    }
  }

  exportarExcel() {
    console.log('Exportar comisiones', this.filteredComisiones());
  }

  imprimir() {
    window.print();
  }
}
