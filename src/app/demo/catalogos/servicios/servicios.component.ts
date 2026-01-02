// angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ServiciosService, Servicio } from './servicios.service';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, SharedModule, FormsModule, RouterModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  filteredServicios: Servicio[] = [];

  // Filtros
  filterNombre = '';
  filterTipo = '';
  filterActivo = '';

  private serviciosService = inject(ServiciosService);

  ngOnInit() {
    this.loadServicios();
  }

  loadServicios() {
    this.servicios = this.serviciosService.getServicios();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredServicios = this.servicios.filter(s => {
      return (!this.filterNombre || s.nombre.toLowerCase().includes(this.filterNombre.toLowerCase())) &&
             (!this.filterTipo || s.tipo === this.filterTipo) &&
             (!this.filterActivo || (this.filterActivo === 'activo' ? s.activo : !s.activo));
    });
  }

  deleteServicio(id: number) {
    this.serviciosService.deleteServicio(id);
    this.loadServicios();
  }

  getTipoBadge(tipo: string) {
    const badges = {
      transporte: 'badge-primary',
      tour: 'badge-success',
      alojamiento: 'badge-info',
      otro: 'badge-secondary'
    };
    return badges[tipo as keyof typeof badges] || 'badge-light';
  }

  getActivoBadge(activo: boolean) {
    return activo ? 'badge-success' : 'badge-danger';
  }
}
