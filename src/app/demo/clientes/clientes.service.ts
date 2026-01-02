// angular import
import { Injectable } from '@angular/core';

// project import
export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  tipo: 'cliente' | 'suplidor';
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private clientes: Cliente[] = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '8888-8888',
      tipo: 'cliente'
    },
    {
      id: 2,
      nombre: 'Transportes Costa Rica',
      email: 'info@transportescr.com',
      telefono: '2222-2222',
      tipo: 'suplidor'
    }
  ];

  getClientes(): Cliente[] {
    return this.clientes;
  }

  addCliente(cliente: Omit<Cliente, 'id'>): void {
    const newId = Math.max(...this.clientes.map(c => c.id)) + 1;
    this.clientes.push({ ...cliente, id: newId });
  }
}