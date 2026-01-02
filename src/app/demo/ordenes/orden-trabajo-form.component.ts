import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { EstadoOrden, OrdenTrabajo, OrdenTrabajoDetalle, OrdenesService } from './ordenes.service';
import { ReservaDetalleDisponible, ReservasService } from '../reservas/reservas.service';

@Component({
  selector: 'app-orden-trabajo-form',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './orden-trabajo-form.component.html',
  styleUrls: ['./orden-trabajo-form.component.scss']
})
export class OrdenTrabajoFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ordenesService = inject(OrdenesService);
  private reservasService = inject(ReservasService);
  private orden?: OrdenTrabajo;
  private subs = new Subscription();

  form = this.fb.group({
    numeroOrden: [{ value: '', disabled: true }],
    fechaCreacion: [{ value: '', disabled: true }],
    fechaServicio: ['', Validators.required],
    estado: ['Pendiente' as EstadoOrden, Validators.required],
    suplidor: ['', Validators.required],
    ruta: [''],
    conexion: [''],
    observaciones: [''],
    kmInicial: [null],
    kmFinal: [null],
    rotulacion: [false],
    totalPagar: [0]
  });

  detallesDisponibles: ReservaDetalleDisponible[] = [];
  detallesSeleccionados = new Set<string>();
  detallesOrden: OrdenTrabajoDetalle[] = [];
  estadoBloqueado = false;
  isEdit = false;
  titulo = 'Nueva Orden de Trabajo';

  ngOnInit(): void {
    this.subs.add(
      this.route.params.subscribe(params => {
        const id = params['id'];
        if (id) {
          this.loadOrden(Number(id));
        } else {
          this.initNuevaOrden();
        }
        this.refreshDisponibles();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get totalServicios(): number {
    return this.detallesOrden.length;
  }

  get totalPax(): number {
    return this.detallesOrden.reduce((sum, d) => sum + d.pax, 0);
  }

  get totalPagarSugerido(): number {
    return this.detallesOrden.reduce((sum, d) => sum + d.pax * 15000, 0);
  }

  get estadosDisponibles(): EstadoOrden[] {
    return ['Pendiente', 'Asignada', 'En Proceso', 'Finalizada'];
  }

  toggleSeleccion(detalle: ReservaDetalleDisponible, checked: boolean): void {
    if (checked) {
      this.detallesSeleccionados.add(detalle.key);
    } else {
      this.detallesSeleccionados.delete(detalle.key);
    }
  }

  agregarSeleccionados(): void {
    const seleccionados = this.detallesDisponibles.filter(det => this.detallesSeleccionados.has(det.key));
    if (!seleccionados.length || this.estadoBloqueado) {
      return;
    }
    let nextId = this.getNextDetalleId();
    seleccionados.forEach(det => {
      const detalleOrden = this.ordenesService.mapDisponibleADetalle(det, nextId++);
      this.detallesOrden.push(detalleOrden);
    });
    this.detallesSeleccionados.clear();
    this.recalcularTotales();
    this.refreshDisponibles();
  }

  quitarDetalle(detalle: OrdenTrabajoDetalle): void {
    if (this.estadoBloqueado) {
      return;
    }
    this.detallesOrden = this.detallesOrden.filter(d => d.id !== detalle.id);
    this.recalcularTotales();
    this.refreshDisponibles();
  }

  actualizarDetalle(detalle: OrdenTrabajoDetalle, campo: 'fechaServicio' | 'hora', valor: string): void {
    detalle[campo] = valor;
  }

  guardar(estado?: EstadoOrden): void {
    if (this.form.invalid || !this.detallesOrden.length) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const estadoFinal = estado ?? raw.estado ?? 'Pendiente';

    const payload: OrdenTrabajo = {
      id: this.orden?.id || 0,
      numeroOrden: this.orden?.numeroOrden || 0,
      fechaCreacion: this.orden?.fechaCreacion || new Date().toISOString().split('T')[0],
      fechaServicio: raw.fechaServicio || '',
      suplidor: raw.suplidor || '',
      ruta: raw.ruta || '',
      conexion: raw.conexion || '',
      observaciones: raw.observaciones || '',
      kmInicial: raw.kmInicial ?? undefined,
      kmFinal: raw.kmFinal ?? undefined,
      rotulacion: raw.rotulacion ?? false,
      estado: estadoFinal,
      detalles: this.detallesOrden,
      totalPax: this.totalPax,
      totalPagar: raw.totalPagar || this.totalPagarSugerido
    };

    if (this.isEdit && this.orden) {
      payload.id = this.orden.id;
      payload.numeroOrden = this.orden.numeroOrden;
      payload.fechaCreacion = this.orden.fechaCreacion;
      this.ordenesService.updateOrden(payload);
    } else {
      this.ordenesService.createOrden(payload);
    }

    this.estadoBloqueado = estadoFinal === 'Finalizada';
    this.router.navigate(['/operaciones/ordenes-trabajo']);
  }

  guardarYAsignar(): void {
    this.guardar('Asignada');
  }

  finalizar(): void {
    this.guardar('Finalizada');
  }

  cancelar(): void {
    this.router.navigate(['/operaciones/ordenes-trabajo']);
  }

  getEstadoBadge(estado?: EstadoOrden | null): string {
    const badges = {
      Pendiente: 'bg-secondary text-white',
      Asignada: 'bg-primary',
      'En Proceso': 'bg-warning text-dark',
      Finalizada: 'bg-success',
      Anulada: 'bg-danger'
    };
    return badges[estado || 'Pendiente'] || 'bg-light text-dark';
  }

  private initNuevaOrden(): void {
    this.isEdit = false;
    this.titulo = 'Nueva Orden de Trabajo';
    const hoy = new Date().toISOString().split('T')[0];
    this.form.patchValue({
      numeroOrden: 'Auto',
      fechaCreacion: hoy,
      fechaServicio: hoy,
      estado: 'Pendiente',
      totalPagar: 0
    });
    this.detallesOrden = [];
    this.estadoBloqueado = false;
  }

  private loadOrden(id: number): void {
    const orden = this.ordenesService.getOrdenById(id);
    if (!orden) {
      this.router.navigate(['/operaciones/ordenes-trabajo']);
      return;
    }
    this.orden = orden;
    this.isEdit = true;
    this.titulo = `Editar Orden #${orden.numeroOrden}`;
    this.detallesOrden = [...orden.detalles];
    this.estadoBloqueado = orden.estado === 'Finalizada';

    this.form.patchValue({
      numeroOrden: String(orden.numeroOrden),
      fechaCreacion: orden.fechaCreacion,
      fechaServicio: orden.fechaServicio,
      estado: orden.estado,
      suplidor: orden.suplidor,
      ruta: orden.ruta,
      conexion: orden.conexion,
      observaciones: orden.observaciones,
      kmInicial: orden.kmInicial,
      kmFinal: orden.kmFinal,
      rotulacion: orden.rotulacion,
      totalPagar: orden.totalPagar
    });
  }

  private refreshDisponibles(): void {
    const asignados = this.ordenesService.getDetallesAsignados();
    this.detallesOrden.forEach(det => asignados.delete(`${det.reservaId}-${det.detalleReservaId ?? det.id}`));
    this.detallesDisponibles = this.reservasService.getDetallesDisponibles(asignados);
  }

  private getNextDetalleId(): number {
    return this.detallesOrden.length ? Math.max(...this.detallesOrden.map(d => d.id)) + 1 : 1;
  }

  private recalcularTotales(): void {
    if (!this.detallesOrden.length) {
      this.form.patchValue({ totalPagar: 0 }, { emitEvent: false });
      return;
    }
    if (!this.form.get('totalPagar')?.value) {
      this.form.patchValue({ totalPagar: this.totalPagarSugerido }, { emitEvent: false });
    }
  }
}
