import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Reserva, ReservaFiltros, ReservasService } from './reservas.service';

@Component({
  selector: 'app-reservas',
  imports: [CommonModule, SharedModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit, OnDestroy {
  reservas: Reserva[] = [];
  filteredReservas: Reserva[] = [];
  pagedReservas: Reserva[] = [];
  filtros: ReservaFiltros = {
    numeroBoleta: '',
    fechaDesde: '',
    fechaHasta: '',
    clienteFinal: '',
    agencia: '',
    estado: '',
    formaPago: ''
  };

  agencias: string[] = [];
  formasPago: string[] = [];
  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 1;

  private subscriptions = new Subscription();
  private reservasService = inject(ReservasService);
  private router = inject(Router);

  ngOnInit(): void {
    this.subscriptions.add(
      this.reservasService.getAll().subscribe(reservas => {
        this.reservas = reservas;
        this.buildCatalogos(reservas);
        this.applyFilters();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  applyFilters(): void {
    this.filteredReservas = this.reservasService.getByFiltros(this.filtros);
    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.filtros = {
      numeroBoleta: '',
      fechaDesde: '',
      fechaHasta: '',
      clienteFinal: '',
      agencia: '',
      estado: '',
      formaPago: ''
    };
    this.applyFilters();
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagination();
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredReservas.length / this.pageSize));
  }

  get pageStart(): number {
    return this.filteredReservas.length ? (this.pageSize * (this.currentPage - 1)) + 1 : 0;
  }

  get pageEnd(): number {
    return Math.min(this.pageSize * this.currentPage, this.filteredReservas.length);
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedReservas = this.filteredReservas.slice(start, end);
  }

  nuevaReserva(): void {
    this.router.navigate(['/operaciones/reservas/nueva']);
  }

  verReserva(reserva: Reserva): void {
    console.log('Ver/Editar Reserva', reserva);
  }

  verDetalles(reserva: Reserva): void {
    console.log('Ver Detalles de Reserva', reserva);
  }

  imprimirConfirmacion(reserva: Reserva): void {
    console.log('Imprimir Confirmacion', reserva);
  }

  cancelarReserva(reserva: Reserva): void {
    this.reservasService.cancel(reserva.id);
    this.applyFilters();
  }

  getEstadoBadge(estado: Reserva['estado']): string {
    const badges = {
      Pendiente: 'bg-warning text-dark',
      Confirmada: 'bg-success',
      Cancelada: 'bg-danger'
    };
    return badges[estado] || 'bg-light text-dark';
  }

  getServiciosBadge(cantidad: number): string {
    return cantidad > 1 ? 'bg-primary text-white' : 'bg-light text-dark';
  }

  trackByReservaId(index: number, reserva: Reserva): number {
    return reserva.id;
  }

  private buildCatalogos(reservas: Reserva[]): void {
    this.agencias = Array.from(new Set(reservas.map(r => r.agencia))).sort();
    this.formasPago = Array.from(new Set(reservas.map(r => r.formaPago))).sort();
  }

  getCantidadServicios(reserva: Reserva): number {
    return reserva.detalles?.length || 0;
  }
}
