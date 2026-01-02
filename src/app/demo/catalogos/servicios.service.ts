// angular import
import { Injectable, signal } from '@angular/core';

// project import
export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria: string;
  activa: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private servicios = signal<Servicio[]>([
    {
      id: 1,
      nombre: 'Transporte Hotel-Hotel',
      descripcion: 'Servicio de transporte entre hoteles',
      categoria: 'Transporte',
      activa: true
    },
    {
      id: 2,
      nombre: 'Transporte Privado',
      descripcion: 'Servicio de transporte privado',
      categoria: 'Transporte',
      activa: true
    },
    {
      id: 3,
      nombre: 'Tours',
      descripcion: 'Servicios de tours guiados',
      categoria: 'Excursiones',
      activa: true
    },
    {
      id: 4,
      nombre: 'Alimentacion',
      descripcion: 'Servicios de alimentacion',
      categoria: 'Gastronomia',
      activa: true
    },
    {
      id: 5,
      nombre: 'Habitaciones',
      descripcion: 'Alojamiento en habitaciones',
      categoria: 'Alojamiento',
      activa: true
    }
  ]);

  getServicios() {
    return this.servicios;
  }

  getServicioById(id: number) {
    return this.servicios().find(s => s.id === id);
  }

  getServiciosActivos() {
    return this.servicios().filter(s => s.activa);
  }
}
