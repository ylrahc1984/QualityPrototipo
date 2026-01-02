// angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ListasPreciosService, ListaPrecio } from './listas-precios.service';

@Component({
  selector: 'app-lista-precio-form',
  imports: [CommonModule, SharedModule, FormsModule],
  templateUrl: './lista-precio-form.component.html',
  styleUrls: ['./lista-precio-form.component.scss']
})
export class ListaPrecioFormComponent implements OnInit {
  formData: Partial<ListaPrecio> = {};
  isEditing = false;
  listaId: number | null = null;

  private listasPreciosService = inject(ListasPreciosService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.listaId = +id;
      const listaPrecio = this.listasPreciosService.getListaPrecioById(this.listaId);
      if (listaPrecio) {
        this.formData = { ...listaPrecio };
      }
    } else {
      this.isEditing = false;
      this.formData = {
        nombre: '',
        descripcion: '',
        moneda: 'CRC',
        vigenciaDesde: new Date(),
        vigenciaHasta: new Date(),
        activa: true,
        observaciones: ''
      };
    }
  }

  save() {
    if (this.validateForm()) {
      if (this.isEditing && this.listaId) {
        this.listasPreciosService.updateListaPrecio(this.listaId, this.formData);
      } else {
        this.listasPreciosService.createListaPrecio(this.formData as Omit<ListaPrecio, 'id' | 'updatedAt'>);
      }
      this.router.navigate(['/catalogos/listas-precios']);
    }
  }

  cancel() {
    this.router.navigate(['/catalogos/listas-precios']);
  }

  validateForm(): boolean {
    return !!(this.formData.nombre && this.formData.moneda &&
             this.formData.vigenciaDesde && this.formData.vigenciaHasta &&
             this.isValidDateRange());
  }

  isValidDateRange(): boolean {
    if (!this.formData.vigenciaDesde || !this.formData.vigenciaHasta) {
      return false;
    }
    return new Date(this.formData.vigenciaHasta) >= new Date(this.formData.vigenciaDesde);
  }

  hasDateRangeError(): boolean {
    return !!(this.formData.vigenciaDesde && this.formData.vigenciaHasta &&
             new Date(this.formData.vigenciaHasta) < new Date(this.formData.vigenciaDesde));
  }
}