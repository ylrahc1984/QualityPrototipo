// angular import
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ListasPreciosService, ListaPrecio } from './listas-precios.service';

@Component({
  selector: 'app-listas-precios',
  imports: [CommonModule, SharedModule, FormsModule, RouterModule],
  templateUrl: './listas-precios.component.html',
  styleUrls: ['./listas-precios.component.scss']
})
export class ListasPreciosComponent implements OnInit {
  private listasPreciosService = inject(ListasPreciosService);
  private router = inject(Router);
  
  listasPrecios = this.listasPreciosService.getListasPrecios();

  // Filtros
  filterNombre = signal('');
  filterEstado = signal('');
  filterMoneda = signal('');
  filterVigenciaDesde = signal('');
  filterVigenciaHasta = signal('');

  // Computed filtered list
  filteredListas = computed(() => {
    return this.listasPrecios().filter(lp => {
      const matchesNombre = !this.filterNombre() ||
        lp.nombre.toLowerCase().includes(this.filterNombre().toLowerCase()) ||
        (lp.descripcion && lp.descripcion.toLowerCase().includes(this.filterNombre().toLowerCase()));

      const matchesEstado = !this.filterEstado() ||
        (this.filterEstado() === 'activa' && lp.activa) ||
        (this.filterEstado() === 'inactiva' && !lp.activa);

      const matchesMoneda = !this.filterMoneda() || lp.moneda === this.filterMoneda();

      const matchesVigencia = (!this.filterVigenciaDesde() || lp.vigenciaDesde >= new Date(this.filterVigenciaDesde())) &&
                             (!this.filterVigenciaHasta() || lp.vigenciaHasta <= new Date(this.filterVigenciaHasta()));

      return matchesNombre && matchesEstado && matchesMoneda && matchesVigencia;
    });
  });

  ngOnInit() {
    // No need to load data, signal is reactive
  }

  // loadListasPrecios() {
  //   this.listasPrecios.set(this.listasPreciosService.getListasPrecios()());
  // }

  openForm(listaPrecio?: ListaPrecio) {
    if (listaPrecio) {
      this.router.navigate(['/catalogos/listas-precios', listaPrecio.id, 'editar']);
    } else {
      this.router.navigate(['/catalogos/listas-precios/nuevo']);
    }
  }

  // closeForm() {
  //   this.showForm = false;
  //   this.editingLista = null;
  // }

  // onFormSave() {
  //   this.closeForm();
  // }

  toggleActive(id: number) {
    this.listasPreciosService.toggleActive(id);
  }

  getEstadoBadge(activa: boolean) {
    return activa ? 'badge-success' : 'badge-danger';
  }

  getEstadoText(activa: boolean) {
    return activa ? 'Activa' : 'Inactiva';
  }

  formatDate(date: Date) {
    return date.toLocaleDateString('es-ES');
  }
}