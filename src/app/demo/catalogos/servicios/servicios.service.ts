// angular import
import { Injectable } from '@angular/core';

// project import
export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo: 'transporte' | 'tour' | 'alojamiento' | 'otro';
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private servicios: Servicio[] = [
    {
      id: 1,
      nombre: 'Transporte Aeropuerto - Hotel',
      descripcion: 'Servicio de transporte desde el aeropuerto hasta el hotel',
      precio: 25000,
      tipo: 'transporte',
      activo: true
    },
    {
      id: 2,
      nombre: 'Tour Volcán Arenal',
      descripcion: 'Excursión al volcán Arenal con guía incluido',
      precio: 75000,
      tipo: 'tour',
      activo: true
    },
    {
      id: 3,
      nombre: 'Alojamiento Hotel Costa Rica',
      descripcion: 'Habitación doble con vista al mar',
      precio: 120000,
      tipo: 'alojamiento',
      activo: true
    }
  ];

  getServicios(): Servicio[] {
    return this.servicios;
  }

  getServicioById(id: number): Servicio | undefined {
    return this.servicios.find(s => s.id === id);
  }

  addServicio(servicio: Omit<Servicio, 'id'>): void {
    const newId = Math.max(...this.servicios.map(s => s.id)) + 1;
    this.servicios.push({ ...servicio, id: newId });
  }

  updateServicio(id: number, servicio: Partial<Servicio>): void {
    const index = this.servicios.findIndex(s => s.id === id);
    if (index !== -1) {
      this.servicios[index] = { ...this.servicios[index], ...servicio };
    }
  }

  deleteServicio(id: number): void {
    this.servicios = this.servicios.filter(s => s.id !== id);
  }
}