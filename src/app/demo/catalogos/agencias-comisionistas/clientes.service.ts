import { Injectable, signal } from '@angular/core';

export type TipoCliente = 'Agencia' | 'Comisionista' | 'Corporativo';

export interface Cliente {
  codigo: string;            // MPV00_CodClien
  nombre: string;            // MPV00_NomClien
  identificacion: string;    // MPV00_RucClien
  contacto?: string;         // MPV00_Contacto
  direccion?: string;        // MPV00_DirClien
  provincia?: string;        // MPV00_IdProvincia
  canton?: string;           // MPV00_IdCanton
  distrito?: string;         // MPV00_IdDistrito
  pais?: string;             // MPV00_PaiClien
  zona?: string;             // MPV00_Zona
  email?: string;            // MPV00_Email
  telefono1?: string;        // MPV00_Te1Clien
  telefono2?: string;        // MPV00_Te2Clien
  fax?: string;              // MPV00_FaxClien
  tipoCliente?: TipoCliente; // MPV00_TCliente
  tipoInterno?: string;      // MPV00_TipClien
  montoCredito?: number;     // MPV00_MtoCredito
  banderaCorreo?: boolean;   // MPV00_BanderaCorreo
  operador: string;          // MPV00_Operador
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private clientes = signal<Cliente[]>([
    {
      codigo: 'AG-001',
      nombre: 'Agencia Monteverde Tours',
      identificacion: '3-101-123456',
      contacto: 'Laura Jimenez',
      email: 'contacto@monteverdetours.cr',
      telefono1: '22223333',
      provincia: 'Puntarenas',
      canton: 'Monteverde',
      tipoCliente: 'Agencia',
      montoCredito: 2500,
      banderaCorreo: true,
      operador: 'Sistema',
      activo: true
    },
    {
      codigo: 'CM-002',
      nombre: 'Comisionista Hotel Bosque Verde',
      identificacion: '2-050-778899',
      contacto: 'Carlos Rojas',
      email: 'c.rojas@bosqueverde.cr',
      telefono1: '22887766',
      tipoCliente: 'Comisionista',
      montoCredito: 800,
      banderaCorreo: false,
      operador: 'Sistema',
      activo: true
    },
    {
      codigo: 'AG-003',
      nombre: 'Agencia Nacional CR Travel',
      identificacion: '3-102-554433',
      contacto: 'Maria Solano',
      email: 'info@crtravel.cr',
      telefono1: '22995544',
      provincia: 'San Jose',
      canton: 'Central',
      tipoCliente: 'Agencia',
      montoCredito: 4000,
      banderaCorreo: true,
      operador: 'Sistema',
      activo: true
    },
    {
      codigo: 'CR-004',
      nombre: 'Corporativo Empresa XYZ',
      identificacion: '3-999-111222',
      contacto: 'Depto. Compras',
      email: 'compras@xyz.com',
      telefono1: '40001234',
      tipoCliente: 'Corporativo',
      montoCredito: 10000,
      banderaCorreo: true,
      operador: 'Sistema',
      activo: false
    },
    {
      codigo: 'AG-005',
      nombre: 'Agencia Internacional EcoTours',
      identificacion: '3-888-444555',
      contacto: 'Ana Martinez',
      email: 'ventas@ecotours.com',
      telefono1: '22776655',
      provincia: 'Alajuela',
      canton: 'Alajuela',
      tipoCliente: 'Agencia',
      montoCredito: 5000,
      banderaCorreo: true,
      operador: 'Sistema',
      activo: true
    },
    {
      codigo: 'CM-006',
      nombre: 'Comisionista Freelance',
      identificacion: '1-111-222333',
      contacto: 'Jorge Vargas',
      email: 'jorge.vargas@email.com',
      telefono1: '88887777',
      tipoCliente: 'Comisionista',
      montoCredito: 1200,
      banderaCorreo: false,
      operador: 'Sistema',
      activo: true
    }
  ]);

  getSignal() {
    return this.clientes;
  }

  getAll() {
    return this.clientes();
  }

  getById(codigo: string) {
    return this.clientes().find(c => c.codigo === codigo);
  }

  create(cliente: Cliente) {
    this.clientes.update(items => [...items, cliente]);
  }

  update(cliente: Cliente) {
    this.clientes.update(items =>
      items.map(c => c.codigo === cliente.codigo ? { ...c, ...cliente } : c)
    );
  }

  toggleActive(codigo: string) {
    this.clientes.update(items =>
      items.map(c =>
        c.codigo === codigo ? { ...c, activo: !c.activo } : c
      )
    );
  }
}
