import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Cliente, ClientesService, TipoCliente } from './clientes.service';
import { ClienteFormComponent } from './cliente-form.component';

@Component({
  selector: 'app-agencias-comisionistas',
  imports: [CommonModule, FormsModule, SharedModule, ClienteFormComponent],
  templateUrl: './agencias-comisionistas.component.html',
  styleUrls: ['./agencias-comisionistas.component.scss']
})
export class AgenciasComisionistasComponent {
  private clientesService = inject(ClientesService);

  filterCodigo = signal('');
  filterNombre = signal('');
  filterIdentificacion = signal('');
  filterTipo = signal<TipoCliente | 'Todos'>('Todos');
  filterProvincia = signal('');
  filterCanton = signal('');

  showForm = false;
  readOnly = false;
  editingCliente: Cliente | null = null;

  clientesSignal = this.clientesService.getSignal();

  provincias = computed(() => {
    const valores = this.clientesSignal().map(c => c.provincia).filter(Boolean) as string[];
    return Array.from(new Set(valores)).sort();
  });

  cantones = computed(() => {
    const valores = this.clientesSignal().map(c => c.canton).filter(Boolean) as string[];
    return Array.from(new Set(valores)).sort();
  });

  clientesFiltrados = computed(() => {
    const codigo = this.filterCodigo().toLowerCase();
    const nombre = this.filterNombre().toLowerCase();
    const identificacion = this.filterIdentificacion().toLowerCase();
    const tipo = this.filterTipo();
    const provincia = this.filterProvincia().toLowerCase();
    const canton = this.filterCanton().toLowerCase();

    return this.clientesSignal().filter(c => {
      return (!codigo || c.codigo.toLowerCase().includes(codigo)) &&
             (!nombre || c.nombre.toLowerCase().includes(nombre)) &&
             (!identificacion || c.identificacion.toLowerCase().includes(identificacion)) &&
             (tipo === 'Todos' || c.tipoCliente === tipo) &&
             (!provincia || (c.provincia || '').toLowerCase().includes(provincia)) &&
             (!canton || (c.canton || '').toLowerCase().includes(canton));
    });
  });

  openForm(cliente?: Cliente, readOnly = false) {
    this.editingCliente = cliente ? { ...cliente } : null;
    this.readOnly = readOnly;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingCliente = null;
    this.readOnly = false;
  }

  onSave(cliente: Cliente) {
    if (this.editingCliente) {
      this.clientesService.update(cliente);
    } else {
      this.clientesService.create(cliente);
    }
    this.closeForm();
  }

  toggleActive(codigo: string) {
    this.clientesService.toggleActive(codigo);
  }

  clearFilters() {
    this.filterCodigo.set('');
    this.filterNombre.set('');
    this.filterIdentificacion.set('');
    this.filterTipo.set('Todos');
    this.filterProvincia.set('');
    this.filterCanton.set('');
  }

  getEstadoCorreoBadge(value?: boolean) {
    return value ? 'badge-success' : 'badge-secondary';
  }

  getActivoBadge(activo: boolean) {
    return activo ? 'badge-success' : 'badge-danger';
  }
}
