import { Injectable, signal } from '@angular/core';

export type TipoSuplidor = 'Transportista' | 'Guía' | 'Empresa' | 'Otro';

export interface Suplidor {
  codigo: string;
  nombre: string;
  identificacion: string;
  tipoSuplidor: TipoSuplidor;
  contacto?: string;
  email?: string;
  telefono1?: string;
  telefono2?: string;
  direccion?: string;
  provincia?: string;
  canton?: string;
  distrito?: string;
  servicios: string[];
  observaciones?: string;
  activo: boolean;
  formaPagoPreferida?: string;
  monedaPago?: string;
  condicionesEspeciales?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SuplidoresService {
  private suplidores = signal<Suplidor[]>([
    {
      codigo: 'SP-001',
      nombre: 'Transportes Monteverde S.A.',
      identificacion: '3-101-445566',
      tipoSuplidor: 'Transportista',
      contacto: 'Carlos Méndez',
      email: 'operaciones@tmonteverde.cr',
      telefono1: '2222-3344',
      provincia: 'Puntarenas',
      canton: 'Monteverde',
      servicios: ['Transporte Hotel-Hotel', 'Transporte Privado'],
      observaciones: 'Especialistas en zonas montañosas.',
      activo: true,
      formaPagoPreferida: 'Transferencia',
      monedaPago: 'CRC'
    },
    {
      codigo: 'SP-002',
      nombre: 'Guía Local Juan Pérez',
      identificacion: '1-1234-5678',
      tipoSuplidor: 'Guía',
      contacto: 'Juan Pérez',
      email: 'juanperez.guia@email.com',
      telefono1: '8888-1234',
      servicios: ['Tours'],
      observaciones: 'Guía bilingüe (ES/EN).',
      activo: true,
      formaPagoPreferida: 'Efectivo',
      monedaPago: 'CRC'
    },
    {
      codigo: 'SP-003',
      nombre: 'EcoTours Costa Rica',
      identificacion: '3-555-777888',
      tipoSuplidor: 'Empresa',
      contacto: 'Ana Solano',
      email: 'ventas@ecotours.cr',
      telefono1: '2299-7788',
      servicios: ['Tours', 'Transporte Privado'],
      observaciones: 'Operador mayorista.',
      activo: true,
      formaPagoPreferida: 'Transferencia',
      monedaPago: 'USD'
    },
    {
      codigo: 'SP-004',
      nombre: 'Transporte Privado Bosque Verde',
      identificacion: '3-222-909090',
      tipoSuplidor: 'Transportista',
      contacto: 'María Brenes',
      email: 'coordinacion@bosqueverde.cr',
      telefono1: '8700-5566',
      servicios: ['Transporte Privado'],
      observaciones: 'Flota de microbuses ejecutivas.',
      activo: false,
      formaPagoPreferida: 'Transferencia',
      monedaPago: 'USD'
    },
    {
      codigo: 'SP-005',
      nombre: 'Guía Freelance María López',
      identificacion: '1-9876-5432',
      tipoSuplidor: 'Guía',
      contacto: 'María López',
      email: 'maria.lopez.guia@email.com',
      telefono1: '8701-3344',
      servicios: ['Tours'],
      observaciones: 'Especialista en turismo de aventura.',
      activo: true,
      formaPagoPreferida: 'Efectivo',
      monedaPago: 'CRC'
    },
    {
      codigo: 'SP-006',
      nombre: 'Operador Turístico Aventura CR',
      identificacion: '3-333-222111',
      tipoSuplidor: 'Empresa',
      contacto: 'Departamento Comercial',
      email: 'info@aventuracr.com',
      telefono1: '4000-2211',
      servicios: ['Tours', 'Transporte Hotel-Hotel'],
      observaciones: 'Paquetes multi-destino.',
      activo: true,
      formaPagoPreferida: 'Transferencia',
      monedaPago: 'USD'
    }
  ]);

  getSignal() {
    return this.suplidores;
  }

  getAll() {
    return this.suplidores();
  }

  getByCodigo(codigo: string) {
    return this.suplidores().find(s => s.codigo === codigo);
  }

  create(suplidor: Suplidor) {
    this.suplidores.update(items => [...items, { ...suplidor }]);
  }

  update(suplidor: Suplidor) {
    this.suplidores.update(items =>
      items.map(item => item.codigo === suplidor.codigo ? { ...item, ...suplidor } : item)
    );
  }

  toggleActive(codigo: string) {
    this.suplidores.update(items =>
      items.map(item => item.codigo === codigo ? { ...item, activo: !item.activo } : item)
    );
  }
}
