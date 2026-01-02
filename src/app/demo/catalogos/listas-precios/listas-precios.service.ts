// angular import
import { Injectable, signal } from '@angular/core';

// Datos y modelos para listas de precios y reglas tarifarias (mock)
export interface ListaPrecio {
  id: number;
  nombre: string;
  descripcion?: string;
  moneda: 'CRC' | 'USD' | 'EUR';
  vigenciaDesde: Date;
  vigenciaHasta: Date;
  activa: boolean;
  updatedAt: Date;
  observaciones?: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria: string;
  activa: boolean;
}

export interface ReglaTarifa {
  id: number;
  listaPrecioId: number;
  servicioId: number;
  servicioNombre: string;
  tarifa: 'A' | 'B' | 'C' | 'D';
  horaInicio: string;
  horaFin: string;
  precioBase: number;
  adultosIncluidos: number;
  precioAdultoExtra: number;
  precioNino: number;
  observaciones?: string;
  activa: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ListasPreciosService {
  private listasPrecios = signal<ListaPrecio[]>([
    {
      id: 1,
      nombre: 'Temporada Alta 2025',
      descripcion: 'Tarifas para temporada alta del ano 2025',
      moneda: 'USD',
      vigenciaDesde: new Date('2025-01-01'),
      vigenciaHasta: new Date('2025-04-30'),
      activa: true,
      updatedAt: new Date('2025-12-01'),
      observaciones: 'Aplicar descuentos para grupos grandes'
    },
    {
      id: 2,
      nombre: 'Temporada Baja 2025',
      descripcion: 'Tarifas reducidas para temporada baja',
      moneda: 'USD',
      vigenciaDesde: new Date('2025-05-01'),
      vigenciaHasta: new Date('2025-12-31'),
      activa: true,
      updatedAt: new Date('2025-12-01')
    },
    {
      id: 3,
      nombre: 'Tarifa Agencias Nacionales',
      descripcion: 'Precios especiales para agencias nacionales',
      moneda: 'CRC',
      vigenciaDesde: new Date('2025-01-01'),
      vigenciaHasta: new Date('2025-12-31'),
      activa: true,
      updatedAt: new Date('2025-11-15'),
      observaciones: 'Requiere contrato firmado'
    },
    {
      id: 4,
      nombre: 'Convenio Hotel Monteverde',
      descripcion: 'Acuerdo especial con Hotel Monteverde',
      moneda: 'USD',
      vigenciaDesde: new Date('2025-03-01'),
      vigenciaHasta: new Date('2025-08-31'),
      activa: false,
      updatedAt: new Date('2025-10-20'),
      observaciones: 'Pendiente renovacion'
    },
    {
      id: 5,
      nombre: 'Corporativo',
      descripcion: 'Tarifas para clientes corporativos',
      moneda: 'USD',
      vigenciaDesde: new Date('2025-01-01'),
      vigenciaHasta: new Date('2025-12-31'),
      activa: true,
      updatedAt: new Date('2025-12-01')
    },
    {
      id: 6,
      nombre: 'Promocion Fin de Ano',
      descripcion: 'Descuentos especiales para fin de ano',
      moneda: 'CRC',
      vigenciaDesde: new Date('2025-12-15'),
      vigenciaHasta: new Date('2025-12-31'),
      activa: false,
      updatedAt: new Date('2025-11-30'),
      observaciones: 'Limitado a habitaciones disponibles'
    }
  ]);

  getListasPrecios() {
    return this.listasPrecios;
  }

  getListaPrecioById(id: number) {
    return this.listasPrecios().find(lp => lp.id === id);
  }

  createListaPrecio(listaPrecio: Omit<ListaPrecio, 'id' | 'updatedAt'>) {
    const current = this.listasPrecios();
    const newId = current.length > 0 ? Math.max(...current.map(lp => lp.id)) + 1 : 1;
    const newLista: ListaPrecio = {
      ...listaPrecio,
      id: newId,
      updatedAt: new Date()
    };
    this.listasPrecios.update(listas => [...listas, newLista]);
    return newLista;
  }

  updateListaPrecio(id: number, updates: Partial<Omit<ListaPrecio, 'id'>>) {
    this.listasPrecios.update(listas =>
      listas.map(lp =>
        lp.id === id
          ? { ...lp, ...updates, updatedAt: new Date() }
          : lp
      )
    );
  }

  toggleActive(id: number) {
    const lista = this.getListaPrecioById(id);
    this.updateListaPrecio(id, { activa: lista ? !lista.activa : false });
  }

  deleteListaPrecio(id: number) {
    this.listasPrecios.update(listas => listas.filter(lp => lp.id !== id));
  }
}

@Injectable({
  providedIn: 'root'
})
export class ReglasTarifariasService {
  private reglasTarifarias = signal<ReglaTarifa[]>([
    // Reglas para Lista de Precios 1 - Transporte Hotel-Hotel
    {
      id: 1,
      listaPrecioId: 1,
      servicioId: 1,
      servicioNombre: 'Transporte Hotel-Hotel',
      tarifa: 'A',
      horaInicio: '06:00',
      horaFin: '18:00',
      precioBase: 80,
      adultosIncluidos: 4,
      precioAdultoExtra: 15,
      precioNino: 10,
      observaciones: 'Tarifa diurna estandar',
      activa: true
    },
    {
      id: 2,
      listaPrecioId: 1,
      servicioId: 1,
      servicioNombre: 'Transporte Hotel-Hotel',
      tarifa: 'A',
      horaInicio: '18:01',
      horaFin: '23:59',
      precioBase: 100,
      adultosIncluidos: 4,
      precioAdultoExtra: 20,
      precioNino: 15,
      observaciones: 'Tarifa nocturna',
      activa: true
    },
    {
      id: 3,
      listaPrecioId: 1,
      servicioId: 1,
      servicioNombre: 'Transporte Hotel-Hotel',
      tarifa: 'B',
      horaInicio: '06:00',
      horaFin: '23:59',
      precioBase: 120,
      adultosIncluidos: 6,
      precioAdultoExtra: 18,
      precioNino: 12,
      observaciones: 'Tarifa premium con mayor capacidad',
      activa: true
    },
    // Reglas para Lista de Precios 2 - Transporte Privado
    {
      id: 4,
      listaPrecioId: 2,
      servicioId: 2,
      servicioNombre: 'Transporte Privado',
      tarifa: 'A',
      horaInicio: '00:00',
      horaFin: '23:59',
      precioBase: 150,
      adultosIncluidos: 4,
      precioAdultoExtra: 25,
      precioNino: 18,
      observaciones: 'Servicio privado 24 horas',
      activa: true
    },
    // Reglas para Lista de Precios 3 - Tours
    {
      id: 5,
      listaPrecioId: 3,
      servicioId: 3,
      servicioNombre: 'Tours',
      tarifa: 'A',
      horaInicio: '08:00',
      horaFin: '17:00',
      precioBase: 200,
      adultosIncluidos: 2,
      precioAdultoExtra: 50,
      precioNino: 30,
      observaciones: 'Tour completo con guia',
      activa: true
    }
  ]);

  getByListaPrecioAndServicio(listaPrecioId: number, servicioId: number) {
    return this.reglasTarifarias().filter(r =>
      r.listaPrecioId === listaPrecioId && r.servicioId === servicioId
    );
  }

  // Alias para compatibilidad con referencias previas
  getReglasByListaPrecioAndServicio(listaPrecioId: number, servicioId: number) {
    return this.getByListaPrecioAndServicio(listaPrecioId, servicioId);
  }

  getReglaById(id: number) {
    return this.reglasTarifarias().find(r => r.id === id);
  }

  create(regla: Omit<ReglaTarifa, 'id'>) {
    const current = this.reglasTarifarias();
    const newId = current.length > 0 ? Math.max(...current.map(r => r.id)) + 1 : 1;
    const newRegla: ReglaTarifa = {
      ...regla,
      id: newId
    };
    this.reglasTarifarias.update(reglas => [...reglas, newRegla]);
    return newRegla;
  }

  createReglaTarifa(regla: Omit<ReglaTarifa, 'id'>) {
    return this.create(regla);
  }

  update(reglaActualizada: ReglaTarifa) {
    const { id, ...rest } = reglaActualizada;
    this.updateReglaTarifa(id, rest);
  }

  updateReglaTarifa(id: number, updates: Partial<Omit<ReglaTarifa, 'id'>>) {
    const current = this.getReglaById(id);
    if (!current) {
      return;
    }

    this.reglasTarifarias.update(reglas =>
      reglas.map(r =>
        r.id === id
          ? { ...r, ...updates }
          : r
      )
    );
  }

  delete(id: number) {
    this.deleteReglaTarifa(id);
  }

  deleteReglaTarifa(id: number) {
    this.reglasTarifarias.update(reglas => reglas.filter(r => r.id !== id));
  }

  toggleActive(id: number) {
    const regla = this.getReglaById(id);
    if (regla) {
      this.updateReglaTarifa(id, { activa: !regla.activa });
    }
  }
}
