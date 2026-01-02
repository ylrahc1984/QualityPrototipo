import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ReservaDetalleDisponible } from '../reservas/reservas.service';

export type EstadoOrden = 'Pendiente' | 'Asignada' | 'En Proceso' | 'Finalizada' | 'Anulada';

export interface OrdenTrabajoDetalle {
  id: number;
  reservaId: number;
  numeroBoleta: number;
  clienteFinal: string;
  agencia: string;
  servicio: string;
  fechaServicio: string;
  hora: string;
  origen: string;
  destino: string;
  pax: number;
  detalleReservaId?: number;
}

export interface OrdenTrabajo {
  id: number;
  numeroOrden: number;
  fechaCreacion: string;
  fechaServicio: string;
  suplidor: string;
  ruta: string;
  conexion?: string;
  observaciones?: string;
  kmInicial?: number;
  kmFinal?: number;
  rotulacion?: boolean;
  estado: EstadoOrden;
  detalles: OrdenTrabajoDetalle[];
  totalPax: number;
  totalPagar: number;
}

export interface OrdenTrabajoFiltros {
  numeroOrden?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  suplidor?: string;
  estado?: EstadoOrden | '';
  rutaZona?: string;
  agencia?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private readonly ordenesSubject = new BehaviorSubject<OrdenTrabajo[]>([
    {
      id: 1,
      numeroOrden: 2025001,
      fechaCreacion: '2025-12-20',
      fechaServicio: '2025-12-23',
      suplidor: 'Transportes Pacífico',
      ruta: 'San José - Aeropuerto SJO',
      estado: 'Pendiente',
      detalles: [
        {
          id: 1,
          reservaId: 1,
          numeroBoleta: 25933,
          clienteFinal: "KIM D'AURIA",
          agencia: 'ELEMENTO NATURAL',
          servicio: 'Traslado Privado',
          fechaServicio: '2025-12-23',
          hora: '08:00',
          origen: 'Hotel Costa Rica',
          destino: 'Aeropuerto SJO',
          pax: 2,
          detalleReservaId: 1
        },
        {
          id: 2,
          reservaId: 2,
          numeroBoleta: 25934,
          clienteFinal: 'CARLOS MENDEZ',
          agencia: 'AMAZON TRAVEL',
          servicio: 'Tour Volcán Arenal',
          fechaServicio: '2025-12-23',
          hora: '07:30',
          origen: 'Hotel Downtown',
          destino: 'Parque Nacional Volcán Arenal',
          pax: 4,
          detalleReservaId: 1
        }
      ],
      totalPax: 6,
      totalPagar: 185000
    },
    {
      id: 2,
      numeroOrden: 2025002,
      fechaCreacion: '2025-12-21',
      fechaServicio: '2025-12-24',
      suplidor: 'Caribe Tours',
      ruta: 'San José - La Fortuna',
      estado: 'Asignada',
      detalles: [
        {
          id: 1,
          reservaId: 3,
          numeroBoleta: 25935,
          clienteFinal: 'SOFIA RAMOS',
          agencia: 'BOSQUES TOURS',
          servicio: 'Caminata Nocturna',
          fechaServicio: '2025-12-24',
          hora: '17:00',
          origen: 'Hotel Monteverde',
          destino: 'Reserva Monteverde',
          pax: 2,
          detalleReservaId: 1
        },
        {
          id: 2,
          reservaId: 3,
          numeroBoleta: 25935,
          clienteFinal: 'SOFIA RAMOS',
          agencia: 'BOSQUES TOURS',
          servicio: 'Canopy Tour',
          fechaServicio: '2025-12-24',
          hora: '09:30',
          origen: 'Hotel Monteverde',
          destino: 'Sky Adventures',
          pax: 2,
          detalleReservaId: 2
        }
      ],
      totalPax: 4,
      totalPagar: 198000
    }
  ]);

  private lastId = this.ordenesSubject.getValue().length;
  private readonly detallesAsignados = new Set<string>();

  constructor() {
    this.syncDetallesAsignados();
  }

  getAll(): Observable<OrdenTrabajo[]> {
    return this.ordenesSubject.asObservable();
  }

  getOrdenes(): OrdenTrabajo[] {
    return this.ordenesSubject.getValue();
  }

  getOrdenById(id: number): OrdenTrabajo | undefined {
    return this.getOrdenes().find(o => o.id === id);
  }

  createOrden(
    orden: Omit<OrdenTrabajo, 'id' | 'numeroOrden' | 'fechaCreacion' | 'estado' | 'totalPax'> & { estado?: EstadoOrden; totalPagar?: number }
  ): OrdenTrabajo {
    this.lastId += 1;
    const numeroOrden = this.generarNumeroOrden();
    const fechaCreacion = new Date().toISOString().split('T')[0];
    const estado = orden.estado ?? 'Pendiente';
    const { totalPax, totalPagar } = this.recalcularTotales(orden.detalles, orden.totalPagar);

    const nuevaOrden: OrdenTrabajo = {
      ...orden,
      id: this.lastId,
      numeroOrden,
      fechaCreacion,
      estado,
      totalPax,
      totalPagar
    };

    this.emit([...this.getOrdenes(), nuevaOrden]);
    return nuevaOrden;
  }

  updateOrden(ordenActualizada: OrdenTrabajo): void {
    const { totalPax, totalPagar } = this.recalcularTotales(ordenActualizada.detalles, ordenActualizada.totalPagar);
    const updated = this.getOrdenes().map(orden =>
      orden.id === ordenActualizada.id ? { ...ordenActualizada, totalPax, totalPagar } : orden
    );
    this.emit(updated);
  }

  addDetalle(ordenId: number, detalle: OrdenTrabajoDetalle): void {
    const updated = this.getOrdenes().map(orden => {
      if (orden.id !== ordenId) {
        return orden;
      }
      const detalles = [...orden.detalles, detalle];
      const { totalPax, totalPagar } = this.recalcularTotales(detalles);
      return { ...orden, detalles, totalPax, totalPagar };
    });
    this.emit(updated);
  }

  removeDetalle(ordenId: number, detalleId: number): void {
    const updated = this.getOrdenes().map(orden => {
      if (orden.id !== ordenId) {
        return orden;
      }
      const detalles = orden.detalles.filter(d => d.id !== detalleId);
      const { totalPax, totalPagar } = this.recalcularTotales(detalles);
      return { ...orden, detalles, totalPax, totalPagar };
    });
    this.emit(updated);
  }

  changeEstado(id: number, estado: EstadoOrden): void {
    const updated = this.getOrdenes().map(orden => (orden.id === id ? { ...orden, estado } : orden));
    this.emit(updated);
  }

  actualizarEstado(id: number, estado: EstadoOrden): void {
    this.changeEstado(id, estado);
  }

  anularOrden(id: number): void {
    this.changeEstado(id, 'Anulada');
  }

  filtrarOrdenes(filtros: OrdenTrabajoFiltros): OrdenTrabajo[] {
    return this.getOrdenes().filter(orden => {
      const ruta = orden.ruta || '';
      const matchNumero =
        !filtros.numeroOrden || orden.numeroOrden.toString().toLowerCase().includes(filtros.numeroOrden.toLowerCase());
      const matchFechaDesde = !filtros.fechaDesde || orden.fechaServicio >= filtros.fechaDesde;
      const matchFechaHasta = !filtros.fechaHasta || orden.fechaServicio <= filtros.fechaHasta;
      const matchSuplidor = !filtros.suplidor || orden.suplidor === filtros.suplidor;
      const matchEstado = !filtros.estado || orden.estado === filtros.estado;
      const matchRuta =
        !filtros.rutaZona || ruta.toLowerCase().includes(filtros.rutaZona.toLowerCase());
      const matchAgencia =
        !filtros.agencia ||
        orden.detalles.some(det => det.agencia === filtros.agencia) ||
        (orden.detalles.length === 0 && ruta.includes(filtros.agencia));

      return (
        matchNumero &&
        matchFechaDesde &&
        matchFechaHasta &&
        matchSuplidor &&
        matchEstado &&
        matchRuta &&
        matchAgencia
      );
    });
  }

  getDetallesAsignados(): Set<string> {
    return new Set(this.detallesAsignados);
  }

  mapDisponibleADetalle(disponible: ReservaDetalleDisponible, nextDetalleId: number): OrdenTrabajoDetalle {
    return {
      id: nextDetalleId,
      reservaId: disponible.reservaId,
      numeroBoleta: disponible.numeroBoleta,
      clienteFinal: disponible.clienteFinal,
      agencia: disponible.agencia,
      servicio: disponible.servicio,
      fechaServicio: disponible.fechaServicio,
      hora: disponible.hora,
      origen: disponible.origen,
      destino: disponible.destino,
      pax: disponible.pax,
      detalleReservaId: disponible.detalleReservaId
    };
  }

  private generarNumeroOrden(): number {
    const base = 2025000;
    const currentMax = Math.max(...this.getOrdenes().map(o => o.numeroOrden), base);
    return currentMax + 1;
  }

  private recalcularTotales(detalles: OrdenTrabajoDetalle[], totalPagarManual?: number): { totalPax: number; totalPagar: number } {
    const totalPax = detalles.reduce((sum, d) => sum + d.pax, 0);
    const totalCalculado = detalles.reduce((sum, d) => sum + d.pax * 15000, 0);
    const totalPagar = typeof totalPagarManual === 'number' && totalPagarManual > 0 ? totalPagarManual : totalCalculado;
    return { totalPax, totalPagar };
  }

  private emit(ordenes: OrdenTrabajo[]): void {
    this.ordenesSubject.next(ordenes);
    this.syncDetallesAsignados();
  }

  private syncDetallesAsignados(): void {
    this.detallesAsignados.clear();
    this.getOrdenes().forEach(orden => {
      orden.detalles.forEach(det => {
        const key = `${det.reservaId}-${det.detalleReservaId ?? det.id}`;
        this.detallesAsignados.add(key);
      });
    });
  }
}
