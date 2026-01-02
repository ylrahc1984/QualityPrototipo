import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ReservaDetalle {
  id: number;
  servicio: string;
  fechaServicio: string;
  horaPickup: string;
  horaInicio: string;
  adultos: number;
  ninos: number;
  origenLugar: string;
  origenZona: string;
  origenDireccionGoogle: string;
  origenLat: number;
  origenLng: number;
  origenPlaceId: string;
  destinoLugar: string;
  destinoZona: string;
  destinoDireccionGoogle: string;
  destinoLat: number;
  destinoLng: number;
  destinoPlaceId: string;
  tarifa: string;
  costoNeto: number;
  costoRack: number;
  observaciones?: string;
}

export interface Reserva {
  id: number;
  numeroBoleta: number;
  fecha: string;
  clienteFinal: string;
  agencia: string;
  idioma: string;
  formaReservacion: string;
  formaPago: string;
  estado: 'Pendiente' | 'Confirmada' | 'Cancelada';
  comentarios?: string;
  totalNeto: number;
  totalRack: number;
  detalles: ReservaDetalle[];
}

export interface ReservaDetalleDisponible {
  key: string;
  reservaId: number;
  detalleReservaId: number;
  numeroBoleta: number;
  clienteFinal: string;
  agencia: string;
  servicio: string;
  fechaServicio: string;
  hora: string;
  origen: string;
  destino: string;
  pax: number;
}

export interface ReservaFiltros {
  numeroBoleta?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  clienteFinal?: string;
  agencia?: string;
  estado?: Reserva['estado'] | '';
  formaPago?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private readonly initialData: Reserva[] = [
    {
      id: 1,
      numeroBoleta: 25933,
      fecha: '2025-12-20',
      clienteFinal: "KIM D'AURIA",
      agencia: 'ELEMENTO NATURAL',
      idioma: 'Español',
      formaReservacion: 'Correo Electrónico',
      formaPago: 'Prepago',
      estado: 'Confirmada',
      comentarios: 'Cliente VIP, confirmar 24h antes.',
      detalles: [
        {
          id: 1,
          servicio: 'Traslado Privado',
          fechaServicio: '2025-12-22',
          horaPickup: '08:00',
          horaInicio: '08:30',
          adultos: 2,
          ninos: 0,
          origenLugar: 'Hotel Costa Rica',
          origenZona: 'San José',
          destinoLugar: 'Aeropuerto SJO',
          destinoZona: 'Alajuela',
          tarifa: 'A',
          costoNeto: 75000,
          costoRack: 90000,
          observaciones: 'Incluir silla bebé'
        }
      ],
      totalNeto: 75000,
      totalRack: 90000
    },
    {
      id: 2,
      numeroBoleta: 25934,
      fecha: '2025-12-20',
      clienteFinal: 'CARLOS MENDEZ',
      agencia: 'AMAZON TRAVEL',
      idioma: 'Inglés',
      formaReservacion: 'Web',
      formaPago: 'Crédito',
      estado: 'Pendiente',
      comentarios: '',
      detalles: [
        {
          id: 1,
          servicio: 'Tour Volcán Arenal',
          fechaServicio: '2025-12-23',
          horaPickup: '07:30',
          horaInicio: '08:30',
          adultos: 3,
          ninos: 1,
          origenLugar: 'Hotel Downtown',
          origenZona: 'San José',
          destinoLugar: 'Parque Nacional Volcán Arenal',
          destinoZona: 'La Fortuna',
          tarifa: 'B',
          costoNeto: 120000,
          costoRack: 144000,
          observaciones: ''
        },
        {
          id: 2,
          servicio: 'Traslado Compartido',
          fechaServicio: '2025-12-24',
          horaPickup: '14:00',
          horaInicio: '14:30',
          adultos: 3,
          ninos: 1,
          origenLugar: 'La Fortuna Hotel',
          origenZona: 'La Fortuna',
          destinoLugar: 'Aeropuerto SJO',
          destinoZona: 'Alajuela',
          tarifa: 'A',
          costoNeto: 45000,
          costoRack: 54000,
          observaciones: 'Equipaje extra'
        }
      ],
      totalNeto: 165000,
      totalRack: 198000
    },
    {
      id: 3,
      numeroBoleta: 25935,
      fecha: '2025-12-19',
      clienteFinal: 'SOFIA RAMOS',
      agencia: 'BOSQUES TOURS',
      idioma: 'Español',
      formaReservacion: 'Teléfono',
      formaPago: 'Efectivo',
      estado: 'Confirmada',
      comentarios: 'Pagar en efectivo al guía.',
      detalles: [
        {
          id: 1,
          servicio: 'Caminata Nocturna',
          fechaServicio: '2025-12-21',
          horaPickup: '17:00',
          horaInicio: '18:00',
          adultos: 2,
          ninos: 0,
          origenLugar: 'Hotel Monteverde',
          origenZona: 'Monteverde',
          destinoLugar: 'Reserva Monteverde',
          destinoZona: 'Monteverde',
          tarifa: 'B',
          costoNeto: 65000,
          costoRack: 78000,
          observaciones: 'Llevar linterna'
        },
        {
          id: 2,
          servicio: 'Canopy Tour',
          fechaServicio: '2025-12-22',
          horaPickup: '09:00',
          horaInicio: '09:30',
          adultos: 2,
          ninos: 0,
          origenLugar: 'Hotel Monteverde',
          origenZona: 'Monteverde',
          destinoLugar: 'Sky Adventures',
          destinoZona: 'Monteverde',
          tarifa: 'C',
          costoNeto: 89500,
          costoRack: 107400,
          observaciones: ''
        },
        {
          id: 3,
          servicio: 'Traslado Privado',
          fechaServicio: '2025-12-23',
          horaPickup: '13:00',
          horaInicio: '13:30',
          adultos: 2,
          ninos: 0,
          origenLugar: 'Monteverde',
          origenZona: 'Monteverde',
          destinoLugar: 'Tamarindo Hotel',
          destinoZona: 'Tamarindo',
          tarifa: 'B',
          costoNeto: 99000,
          costoRack: 118800,
          observaciones: ''
        }
      ],
      totalNeto: 253500,
      totalRack: 304200
    },
    {
      id: 4,
      numeroBoleta: 25936,
      fecha: '2025-12-18',
      clienteFinal: 'LUIS ALONSO',
      agencia: 'SUNSET VACATIONS',
      idioma: 'Español',
      formaReservacion: 'Correo Electrónico',
      formaPago: 'Transferencia',
      estado: 'Cancelada',
      comentarios: 'Cancelada por cliente',
      detalles: [
        {
          id: 1,
          servicio: 'Traslado Privado',
          fechaServicio: '2025-12-19',
          horaPickup: '10:00',
          horaInicio: '10:30',
          adultos: 1,
          ninos: 0,
          origenLugar: 'Hotel San José',
          origenZona: 'San José',
          destinoLugar: 'Puerto Limón',
          destinoZona: 'Limón',
          tarifa: 'A',
          costoNeto: 75000,
          costoRack: 90000,
          observaciones: ''
        }
      ],
      totalNeto: 75000,
      totalRack: 90000
    },
    {
      id: 5,
      numeroBoleta: 25937,
      fecha: '2025-12-22',
      clienteFinal: 'MARIA CASTRO',
      agencia: 'GLOBAL TRAVEL',
      idioma: 'Inglés',
      formaReservacion: 'Teléfono',
      formaPago: 'Prepago',
      estado: 'Pendiente',
      comentarios: '',
      detalles: [
        {
          id: 1,
          servicio: 'Tour Cataratas',
          fechaServicio: '2025-12-24',
          horaPickup: '06:00',
          horaInicio: '07:00',
          adultos: 2,
          ninos: 1,
          origenLugar: 'Hotel Los Sueños',
          origenZona: 'Herradura',
          destinoLugar: 'Catarata La Paz',
          destinoZona: 'Vara Blanca',
          tarifa: 'B',
          costoNeto: 110000,
          costoRack: 132000,
          observaciones: ''
        },
        {
          id: 2,
          servicio: 'Traslado Compartido',
          fechaServicio: '2025-12-25',
          horaPickup: '15:00',
          horaInicio: '15:30',
          adultos: 2,
          ninos: 1,
          origenLugar: 'Vara Blanca',
          origenZona: 'Vara Blanca',
          destinoLugar: 'Aeropuerto SJO',
          destinoZona: 'Alajuela',
          tarifa: 'A',
          costoNeto: 38000,
          costoRack: 45600,
          observaciones: ''
        }
      ],
      totalNeto: 148000,
      totalRack: 177600
    },
    {
      id: 6,
      numeroBoleta: 25938,
      fecha: '2025-12-21',
      clienteFinal: 'DAVID SOLANO',
      agencia: 'PACIFIC RIDES',
      idioma: 'Español',
      formaReservacion: 'Web',
      formaPago: 'Transferencia',
      estado: 'Confirmada',
      comentarios: '',
      detalles: [
        {
          id: 1,
          servicio: 'Traslado Privado',
          fechaServicio: '2025-12-23',
          horaPickup: '11:00',
          horaInicio: '11:30',
          adultos: 1,
          ninos: 0,
          origenLugar: 'Liberia Airport',
          origenZona: 'Liberia',
          destinoLugar: 'Tamarindo Hotel',
          destinoZona: 'Tamarindo',
          tarifa: 'A',
          costoNeto: 62000,
          costoRack: 74400,
          observaciones: ''
        }
      ],
      totalNeto: 62000,
      totalRack: 74400
    },
    {
      id: 7,
      numeroBoleta: 25939,
      fecha: '2025-12-17',
      clienteFinal: 'LUCIA HERRERA',
      agencia: 'MONTANA EXPEDITIONS',
      idioma: 'Inglés',
      formaReservacion: 'WhatsApp',
      formaPago: 'Prepago',
      estado: 'Pendiente',
      comentarios: 'Revisar tarifas para grupo grande',
      detalles: [
        {
          id: 1,
          servicio: 'Tour Café',
          fechaServicio: '2025-12-19',
          horaPickup: '08:00',
          horaInicio: '09:00',
          adultos: 4,
          ninos: 2,
          origenLugar: 'Hotel San José',
          origenZona: 'San José',
          destinoLugar: 'Plantación de Café',
          destinoZona: 'Alajuela',
          tarifa: 'B',
          costoNeto: 150000,
          costoRack: 180000,
          observaciones: ''
        },
        {
          id: 2,
          servicio: 'Traslado Privado',
          fechaServicio: '2025-12-20',
          horaPickup: '12:00',
          horaInicio: '12:30',
          adultos: 4,
          ninos: 2,
          origenLugar: 'Alajuela',
          origenZona: 'Alajuela',
          destinoLugar: 'Jacó Hotel',
          destinoZona: 'Jacó',
          tarifa: 'B',
          costoNeto: 84000,
          costoRack: 100800,
          observaciones: ''
        }
      ],
      totalNeto: 234000,
      totalRack: 280800
    },
    {
      id: 8,
      numeroBoleta: 25940,
      fecha: '2025-12-23',
      clienteFinal: 'GABRIEL SOTO',
      agencia: 'ELEMENTO NATURAL',
      idioma: 'Español',
      formaReservacion: 'Correo Electrónico',
      formaPago: 'Prepago',
      estado: 'Confirmada',
      comentarios: '',
      detalles: [
        {
          id: 1,
          servicio: 'Tour Snorkel',
          fechaServicio: '2025-12-24',
          horaPickup: '10:00',
          horaInicio: '10:30',
          adultos: 2,
          ninos: 0,
          origenLugar: 'Tamarindo Beach',
          origenZona: 'Tamarindo',
          destinoLugar: 'Islas Catalinas',
          destinoZona: 'Catalinas',
          tarifa: 'B',
          costoNeto: 98000,
          costoRack: 117600,
          observaciones: ''
        },
        {
          id: 2,
          servicio: 'Traslado Privado',
          fechaServicio: '2025-12-25',
          horaPickup: '16:00',
          horaInicio: '16:30',
          adultos: 2,
          ninos: 0,
          origenLugar: 'Tamarindo',
          origenZona: 'Tamarindo',
          destinoLugar: 'Liberia Airport',
          destinoZona: 'Liberia',
          tarifa: 'A',
          costoNeto: 52000,
          costoRack: 62400,
          observaciones: ''
        }
      ],
      totalNeto: 150000,
      totalRack: 180000
    },
    {
      id: 9,
      numeroBoleta: 25941,
      fecha: '2025-12-19',
      clienteFinal: 'ELENA DURAN',
      agencia: 'AMAZON TRAVEL',
      idioma: 'Español',
      formaReservacion: 'Teléfono',
      formaPago: 'Crédito',
      estado: 'Cancelada',
      comentarios: 'Reprogramar en enero',
      detalles: [
        {
          id: 1,
          servicio: 'Tour Aves',
          fechaServicio: '2025-12-20',
          horaPickup: '05:00',
          horaInicio: '06:00',
          adultos: 1,
          ninos: 0,
          origenLugar: 'Hotel San José',
          origenZona: 'San José',
          destinoLugar: 'Carara',
          destinoZona: 'Carara',
          tarifa: 'B',
          costoNeto: 52000,
          costoRack: 62400,
          observaciones: ''
        }
      ],
      totalNeto: 52000,
      totalRack: 62400
    },
    {
      id: 10,
      numeroBoleta: 25942,
      fecha: '2025-12-24',
      clienteFinal: 'RAUL ARAYA',
      agencia: 'GLOBAL TRAVEL',
      idioma: 'Español',
      formaReservacion: 'Web',
      formaPago: 'Prepago',
      estado: 'Confirmada',
      comentarios: '',
      detalles: [
        {
          id: 1,
          servicio: 'Tour Rafting',
          fechaServicio: '2025-12-26',
          horaPickup: '07:00',
          horaInicio: '07:30',
          adultos: 2,
          ninos: 0,
          origenLugar: 'Hotel San José',
          origenZona: 'San José',
          destinoLugar: 'Sarapiquí',
          destinoZona: 'Sarapiquí',
          tarifa: 'C',
          costoNeto: 120000,
          costoRack: 144000,
          observaciones: 'Nivel III'
        },
        {
          id: 2,
          servicio: 'Traslado Privado',
          fechaServicio: '2025-12-27',
          horaPickup: '15:00',
          horaInicio: '15:30',
          adultos: 2,
          ninos: 0,
          origenLugar: 'Sarapiquí',
          origenZona: 'Sarapiquí',
          destinoLugar: 'San José',
          destinoZona: 'San José',
          tarifa: 'B',
          costoNeto: 70000,
          costoRack: 84000,
          observaciones: ''
        },
        {
          id: 3,
          servicio: 'Tour Cataratas',
          fechaServicio: '2025-12-28',
          horaPickup: '06:30',
          horaInicio: '07:00',
          adultos: 2,
          ninos: 0,
          origenLugar: 'San José',
          origenZona: 'San José',
          destinoLugar: 'Catarata Nauyaca',
          destinoZona: 'Pérez Zeledón',
          tarifa: 'B',
          costoNeto: 95000,
          costoRack: 114000,
          observaciones: ''
        }
      ],
      totalNeto: 285000,
      totalRack: 342000
    }
  ].map(reserva => ({
    ...reserva,
    detalles: reserva.detalles.map(detalle => this.ensureDetalleGoogleFields(detalle))
  } as Reserva));

  private readonly reservasSubject = new BehaviorSubject<Reserva[]>(this.initialData);

  private lastId = this.initialData.length;

  getAll(): Observable<Reserva[]> {
    return this.reservasSubject.asObservable();
  }

  getCurrent(): Reserva[] {
    return this.reservasSubject.getValue();
  }

  getByFiltros(filtros: ReservaFiltros): Reserva[] {
    const data = this.getCurrent();
    return data.filter(reserva => this.matchesFiltros(reserva, filtros));
  }

  createReserva(reserva: Omit<Reserva, 'id' | 'numeroBoleta' | 'totalNeto' | 'totalRack'> & { estado?: Reserva['estado'] }): Reserva {
    const numeroBoleta = this.generateNumeroBoleta();
    const estado: Reserva['estado'] = reserva.estado ?? 'Pendiente';
    const id = this.lastId + 1;
    const detallesNormalizados = reserva.detalles.map(detalle => this.ensureDetalleGoogleFields(detalle));
    const totals = this.recalcularTotales(detallesNormalizados);

    const nuevaReserva: Reserva = {
      ...reserva,
      detalles: detallesNormalizados,
      id,
      numeroBoleta,
      estado,
      totalNeto: totals.totalNeto,
      totalRack: totals.totalRack
    };

    this.lastId = id;
    this.reservasSubject.next([...this.getCurrent(), nuevaReserva]);

    return nuevaReserva;
  }

  updateReserva(reserva: Reserva): void {
    const detallesNormalizados = reserva.detalles.map(detalle => this.ensureDetalleGoogleFields(detalle));
    const recalculated = {
      ...reserva,
      detalles: detallesNormalizados,
      ...this.recalcularTotales(detallesNormalizados)
    };
    const updated = this.getCurrent().map(item => (item.id === reserva.id ? recalculated : item));
    this.reservasSubject.next(updated);
  }

  cancel(reservaId: number): void {
    const updated = this.getCurrent().map(item =>
      item.id === reservaId ? { ...item, estado: 'Cancelada' as const } : item
    );
    this.reservasSubject.next(updated);
  }

  getById(id: number): Reserva | undefined {
    return this.getCurrent().find(r => r.id === id);
  }

  generateNumeroBoleta(): number {
    const currentMax = Math.max(...this.getCurrent().map(r => r.numeroBoleta));
    return currentMax + 1;
  }

  calculateCosto(detalle: Pick<ReservaDetalle, 'adultos' | 'ninos' | 'tarifa' | 'origenZona' | 'destinoZona'>): {
    costoNeto: number;
    costoRack: number;
  } {
    const paxFactor = detalle.adultos + detalle.ninos * 0.5;
    const tarifaBase: Record<string, number> = { A: 50000, B: 70000, C: 90000, D: 110000 };
    const base = tarifaBase[detalle.tarifa] ?? 50000;
    const ubicacionFactor = detalle.origenZona === detalle.destinoZona ? 1 : 1.15;
    const costoNeto = Math.round(base * ubicacionFactor + paxFactor * 5000);
    const costoRack = Math.round(costoNeto * 1.2);
    return { costoNeto, costoRack };
  }

  getDetallesDisponibles(detallesAsignados: Set<string> = new Set()): ReservaDetalleDisponible[] {
    return this.getCurrent()
      .filter(reserva => reserva.estado === 'Pendiente' || reserva.estado === 'Confirmada')
      .flatMap(reserva =>
        reserva.detalles.map(detalle => {
          const key = `${reserva.id}-${detalle.id}`;
          return {
            key,
            reservaId: reserva.id,
            detalleReservaId: detalle.id,
            numeroBoleta: reserva.numeroBoleta,
            clienteFinal: reserva.clienteFinal,
            agencia: reserva.agencia,
            servicio: detalle.servicio,
            fechaServicio: detalle.fechaServicio,
            hora: detalle.horaInicio || detalle.horaPickup,
            origen: detalle.origenLugar,
            destino: detalle.destinoLugar,
            pax: detalle.adultos + detalle.ninos
          } as ReservaDetalleDisponible;
        })
      )
      .filter(detalle => !detallesAsignados.has(detalle.key));
  }

  // Compatibilidad con componentes existentes
  getReservas(): Reserva[] {
    return this.getCurrent();
  }

  private ensureDetalleGoogleFields(detalle: any): ReservaDetalle {
    return {
      origenDireccionGoogle: detalle.origenDireccionGoogle ?? '',
      origenLat: detalle.origenLat ?? 0,
      origenLng: detalle.origenLng ?? 0,
      origenPlaceId: detalle.origenPlaceId ?? '',
      destinoDireccionGoogle: detalle.destinoDireccionGoogle ?? '',
      destinoLat: detalle.destinoLat ?? 0,
      destinoLng: detalle.destinoLng ?? 0,
      destinoPlaceId: detalle.destinoPlaceId ?? '',
      ...detalle
    };
  }

  private matchesFiltros(reserva: Reserva, filtros: ReservaFiltros): boolean {
    const matchNumero =
      !filtros.numeroBoleta || reserva.numeroBoleta.toString().includes(filtros.numeroBoleta.toString());
    const matchFechaDesde = !filtros.fechaDesde || reserva.fecha >= filtros.fechaDesde;
    const matchFechaHasta = !filtros.fechaHasta || reserva.fecha <= filtros.fechaHasta;
    const matchCliente =
      !filtros.clienteFinal ||
      reserva.clienteFinal.toLowerCase().includes(filtros.clienteFinal.toLowerCase());
    const matchAgencia = !filtros.agencia || reserva.agencia === filtros.agencia;
    const matchEstado = !filtros.estado || reserva.estado === filtros.estado;
    const matchFormaPago = !filtros.formaPago || reserva.formaPago === filtros.formaPago;

    return (
      matchNumero &&
      matchFechaDesde &&
      matchFechaHasta &&
      matchCliente &&
      matchAgencia &&
      matchEstado &&
      matchFormaPago
    );
  }

  private recalcularTotales(detalles: ReservaDetalle[]): { totalNeto: number; totalRack: number } {
    const totalNeto = detalles.reduce((sum, d) => sum + d.costoNeto, 0);
    const totalRack = detalles.reduce((sum, d) => sum + d.costoRack, 0);
    return { totalNeto, totalRack };
  }
}

