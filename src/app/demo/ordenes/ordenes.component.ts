import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { EstadoOrden, OrdenTrabajo, OrdenTrabajoFiltros, OrdenesService } from './ordenes.service';

@Component({
  selector: 'app-ordenes',
  imports: [CommonModule, SharedModule, FormsModule],
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit, OnDestroy {
  ordenes: OrdenTrabajo[] = [];
  ordenesFiltradas: OrdenTrabajo[] = [];
  ordenesPaginadas: OrdenTrabajo[] = [];
  filtros: OrdenTrabajoFiltros = {
    numeroOrden: '',
    fechaDesde: '',
    fechaHasta: '',
    suplidor: '',
    estado: '',
    rutaZona: '',
    agencia: ''
  };

  suplidores: string[] = [];
  agencias: string[] = [];
  zonas: string[] = [];
  estadosDisponibles: EstadoOrden[] = ['Pendiente', 'Asignada', 'En Proceso', 'Finalizada'];
  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 1;

  private subscriptions = new Subscription();
  private ordenesService = inject(OrdenesService);
  private router = inject(Router);

  ngOnInit(): void {
    this.subscriptions.add(
      this.ordenesService.getAll().subscribe(ordenes => {
        this.ordenes = ordenes;
        this.buildCatalogos(ordenes);
        this.applyFilters();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  applyFilters(): void {
    this.ordenesFiltradas = this.ordenesService.filtrarOrdenes(this.filtros);
    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.filtros = {
      numeroOrden: '',
      fechaDesde: '',
      fechaHasta: '',
      suplidor: '',
      estado: '',
      rutaZona: '',
      agencia: ''
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
    return Math.max(1, Math.ceil(this.ordenesFiltradas.length / this.pageSize));
  }

  get pageStart(): number {
    return this.ordenesFiltradas.length ? (this.pageSize * (this.currentPage - 1)) + 1 : 0;
  }

  get pageEnd(): number {
    return Math.min(this.pageSize * this.currentPage, this.ordenesFiltradas.length);
  }

  getEstadoBadge(estado: EstadoOrden): string {
    const badges = {
      Pendiente: 'bg-secondary text-white',
      Asignada: 'bg-primary',
      'En Proceso': 'bg-warning text-dark',
      Finalizada: 'bg-success',
      Anulada: 'bg-danger'
    };
    return badges[estado] || 'bg-light text-dark';
  }

  cambiarEstado(orden: OrdenTrabajo, estado: EstadoOrden): void {
    if (orden.estado === estado) {
      return;
    }
    this.ordenesService.actualizarEstado(orden.id, estado);
    this.applyFilters();
  }

  anularOrden(orden: OrdenTrabajo): void {
    this.ordenesService.anularOrden(orden.id);
    this.applyFilters();
  }

  imprimirOrden(orden: OrdenTrabajo): void {
    console.log('Imprimir Orden de Trabajo', orden.numeroOrden);
  }

  verEditar(orden: OrdenTrabajo): void {
    this.router.navigate(['/operaciones/ordenes-trabajo', orden.id, 'editar']);
  }

  nuevaOrden(): void {
    this.router.navigate(['/operaciones/ordenes-trabajo/nueva']);
  }

  trackByOrdenId(index: number, orden: OrdenTrabajo): number {
    return orden.id;
  }

  private buildCatalogos(ordenes: OrdenTrabajo[]): void {
    this.suplidores = this.uniqueSorted(ordenes.map(o => o.suplidor));
    this.agencias = this.uniqueSorted(
      ordenes.flatMap(o => o.detalles.map(d => d.agencia)).filter(Boolean)
    );
    this.zonas = this.uniqueSorted(
      ordenes.map(o => o.ruta || '').filter(Boolean)
    );
  }

  private uniqueSorted(values: string[]): string[] {
    return Array.from(new Set(values)).sort();
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.ordenesPaginadas = this.ordenesFiltradas.slice(start, end);
  }
}
