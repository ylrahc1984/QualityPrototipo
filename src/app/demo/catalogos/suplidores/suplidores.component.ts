import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Suplidor, SuplidoresService, TipoSuplidor } from './suplidores.service';
import { SuplidorFormComponent } from './suplidor-form.component';

@Component({
  selector: 'app-suplidores',
  imports: [CommonModule, FormsModule, SharedModule, SuplidorFormComponent],
  templateUrl: './suplidores.component.html',
  styleUrls: ['./suplidores.component.scss']
})
export class SuplidoresComponent {
  private suplidoresService = inject(SuplidoresService);

  filterCodigo = signal('');
  filterNombre = signal('');
  filterIdentificacion = signal('');
  filterTipo = signal<TipoSuplidor | 'Todos'>('Todos');
  filterEstado = signal<'Todos' | 'Activo' | 'Inactivo'>('Todos');

  showForm = false;
  readOnly = false;
  editingSuplidor: Suplidor | null = null;

  suplidoresSignal = this.suplidoresService.getSignal();

  suplidoresFiltrados = computed(() => {
    const codigo = this.filterCodigo().toLowerCase();
    const nombre = this.filterNombre().toLowerCase();
    const identificacion = this.filterIdentificacion().toLowerCase();
    const tipo = this.filterTipo();
    const estado = this.filterEstado();

    return this.suplidoresSignal().filter(s => {
      const matchesCodigo = !codigo || s.codigo.toLowerCase().includes(codigo);
      const matchesNombre = !nombre || s.nombre.toLowerCase().includes(nombre);
      const matchesIdentificacion = !identificacion || s.identificacion.toLowerCase().includes(identificacion);
      const matchesTipo = tipo === 'Todos' || s.tipoSuplidor === tipo;
      const matchesEstado = estado === 'Todos' || (estado === 'Activo' ? s.activo : !s.activo);
      return matchesCodigo && matchesNombre && matchesIdentificacion && matchesTipo && matchesEstado;
    });
  });

  openForm(suplidor?: Suplidor, readOnly = false) {
    this.editingSuplidor = suplidor ? { ...suplidor } : null;
    this.readOnly = readOnly;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingSuplidor = null;
    this.readOnly = false;
  }

  onSave(suplidor: Suplidor) {
    if (this.editingSuplidor) {
      this.suplidoresService.update(suplidor);
    } else {
      this.suplidoresService.create(suplidor);
    }
    this.closeForm();
  }

  toggleActive(codigo: string) {
    this.suplidoresService.toggleActive(codigo);
  }

  clearFilters() {
    this.filterCodigo.set('');
    this.filterNombre.set('');
    this.filterIdentificacion.set('');
    this.filterTipo.set('Todos');
    this.filterEstado.set('Todos');
  }

  getTipoBadge(tipo: TipoSuplidor) {
    const badges: Record<TipoSuplidor, string> = {
      Transportista: 'badge-primary',
      Guía: 'badge-info',
      Empresa: 'badge-success',
      Otro: 'badge-secondary'
    };
    return badges[tipo] || 'badge-light';
  }

  getEstadoBadge(activo: boolean) {
    return activo ? 'badge-success' : 'badge-danger';
  }

  resumenServicios(suplidor: Suplidor) {
    if (!suplidor.servicios || suplidor.servicios.length === 0) {
      return 'Sin servicios';
    }
    if (suplidor.servicios.length > 2) {
      const [first, second, ...rest] = suplidor.servicios;
      return `${first}, ${second} +${rest.length} más`;
    }
    return suplidor.servicios.join(', ');
  }
}
