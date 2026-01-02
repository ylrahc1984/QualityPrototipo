// angular import
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ListasPreciosService, ListaPrecio, ReglaTarifa, ReglasTarifariasService } from './listas-precios.service';
import { ServiciosService, Servicio } from '../servicios.service';
import { ReglaTarifaFormComponent } from './regla-tarifa-form.component';

@Component({
  selector: 'app-lista-precio-detalle',
  imports: [CommonModule, SharedModule, FormsModule, ReglaTarifaFormComponent],
  templateUrl: './lista-precio-detalle.component.html',
  styleUrls: ['./lista-precio-detalle.component.scss']
})
export class ListaPrecioDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private listasPreciosService = inject(ListasPreciosService);
  private serviciosService = inject(ServiciosService);
  private reglasService = inject(ReglasTarifariasService);

  listaPrecioId: number = 0;
  listaPrecio: ListaPrecio | null = null;
  selectedServicioId = signal<number>(0);
  showForm = false;
  editingRegla: ReglaTarifa | null = null;

  servicios: Servicio[] = [];

  reglasFiltradas = computed(() => {
    if (this.selectedServicioId() === 0) {
      return [];
    }
    return this.reglasService.getByListaPrecioAndServicio(this.listaPrecioId, this.selectedServicioId());
  });

  ngOnInit() {
    this.loadListaPrecio();
  }

  private setServicioInicial() {
    if (this.servicios.length === 0) {
      return;
    }

    const servicioConReglas = this.servicios.find(s =>
      this.reglasService.getByListaPrecioAndServicio(this.listaPrecioId, s.id).length > 0
    );
    const servicioObjetivo = servicioConReglas || this.servicios[0];

    if (this.selectedServicioId() === 0) {
      this.selectedServicioId.set(servicioObjetivo.id);
    }
  }

  loadListaPrecio() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.volverAListas();
      return;
    }

    this.listaPrecioId = Number(id);
    this.listaPrecio = this.listasPreciosService.getListaPrecioById(this.listaPrecioId) || null;
    this.servicios = this.serviciosService.getServiciosActivos();
    this.setServicioInicial();

    if (!this.listaPrecio) {
      this.volverAListas();
    }
  }

  onServicioChange(servicioId: number | string) {
    const parsedId = Number(servicioId) || 0;
    this.selectedServicioId.set(parsedId);
  }

  openForm(regla?: ReglaTarifa) {
    this.setServicioInicial();
    this.editingRegla = regla || null;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingRegla = null;
  }

  onFormSave() {
    this.closeForm();
  }

  toggleActive(reglaId: number) {
    this.reglasService.toggleActive(reglaId);
  }

  deleteRegla(reglaId: number) {
    if (confirm('Estas seguro de que deseas eliminar esta regla tarifaria?')) {
      this.reglasService.delete(reglaId);
    }
  }

  volverAListas() {
    this.router.navigate(['/catalogos/listas-precios']);
  }

  getEstadoBadge(activa: boolean) {
    return activa ? 'badge-success' : 'badge-danger';
  }

  getEstadoText(activa: boolean) {
    return activa ? 'Activa' : 'Inactiva';
  }

  formatDate(date: Date) {
    if (!date) {
      return '';
    }
    return date.toLocaleDateString('es-ES');
  }

  getServicioNombre(servicioId: number): string {
    const servicio = this.serviciosService.getServicioById(servicioId);
    return servicio?.nombre || 'Servicio no encontrado';
  }

  getIconClass(activa: boolean): string {
    return activa ? 'icon-check-circle' : 'icon-x-circle';
  }

  getPausePlayIcon(activa: boolean): string {
    return activa ? 'icon-pause-circle' : 'icon-play-circle';
  }

  getToggleTitle(activa: boolean): string {
    return activa ? 'Desactivar' : 'Activar';
  }

  getServicioIcon(): string {
    return 'icon-circle';
  }

  getChevronIcon(): string {
    return 'icon-chevron-down';
  }
}
