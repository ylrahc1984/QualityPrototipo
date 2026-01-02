// angular import
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ReglasTarifariasService, ReglaTarifa, ListaPrecio } from './listas-precios.service';
import { ServiciosService } from '../servicios.service';

@Component({
  selector: 'app-regla-tarifa-form',
  imports: [CommonModule, SharedModule, FormsModule],
  templateUrl: './regla-tarifa-form.component.html',
  styleUrls: ['./regla-tarifa-form.component.scss']
})
export class ReglaTarifaFormComponent implements OnInit, OnChanges {
  @Input() reglaTarifa: ReglaTarifa | null = null;
  @Input() listaPrecio: ListaPrecio | null = null;
  @Input() servicioId: number = 0;

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  formData: Partial<Omit<ReglaTarifa, 'tarifa'>> & { tarifa?: ReglaTarifa['tarifa'] } = {};

  private reglasService = inject(ReglasTarifariasService);
  private serviciosService = inject(ServiciosService);

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(_: SimpleChanges) {
    this.initializeForm();
  }

  initializeForm() {
    const baseForm: Partial<ReglaTarifa> = this.reglaTarifa
      ? { ...this.reglaTarifa }
      : {
          listaPrecioId: this.listaPrecio?.id || 0,
          servicioId: this.servicioId,
          servicioNombre: this.getServicioNombre(),
          tarifa: 'A' as ReglaTarifa['tarifa'],
          horaInicio: '08:00',
          horaFin: '18:00',
          precioBase: 0,
          adultosIncluidos: 1,
          precioAdultoExtra: 0,
          precioNino: 0,
          observaciones: '',
          activa: true
        };

    this.formData = {
      ...baseForm,
      listaPrecioId: this.listaPrecio?.id || baseForm.listaPrecioId || 0,
      servicioId: this.servicioId,
      servicioNombre: this.getServicioNombre()
    };
  }

  getServicioNombre(): string {
    if (this.servicioId) {
      const servicio = this.serviciosService.getServicioById(this.servicioId);
      return servicio?.nombre || '';
    }
    return '';
  }

  private syncContextFields() {
    this.formData.listaPrecioId = this.listaPrecio?.id || 0;
    this.formData.servicioId = this.servicioId;
    this.formData.servicioNombre = this.getServicioNombre();
  }

  save() {
    this.syncContextFields();
    if (this.validateForm()) {
      const payload: Omit<ReglaTarifa, 'id'> = {
        listaPrecioId: this.formData.listaPrecioId!,
        servicioId: this.formData.servicioId!,
        servicioNombre: this.formData.servicioNombre || this.getServicioNombre(),
        tarifa: this.formData.tarifa as ReglaTarifa['tarifa'],
        horaInicio: this.formData.horaInicio!,
        horaFin: this.formData.horaFin!,
        precioBase: Number(this.formData.precioBase),
        adultosIncluidos: Number(this.formData.adultosIncluidos),
        precioAdultoExtra: Number(this.formData.precioAdultoExtra ?? 0),
        precioNino: Number(this.formData.precioNino ?? 0),
        observaciones: this.formData.observaciones?.trim(),
        activa: !!this.formData.activa
      };

      if (this.reglaTarifa) {
        this.reglasService.update({ ...payload, id: this.reglaTarifa.id });
      } else {
        this.reglasService.create(payload);
      }
      this.onSave.emit();
    }
  }

  cancel() {
    this.onCancel.emit();
  }

  validateForm(): boolean {
    return !!(this.formData.listaPrecioId &&
             this.formData.servicioId &&
             this.formData.tarifa &&
             this.formData.horaInicio &&
             this.formData.horaFin &&
             this.formData.precioBase !== undefined && this.formData.precioBase >= 0 &&
             this.formData.adultosIncluidos !== undefined && this.formData.adultosIncluidos > 0 &&
             this.formData.precioAdultoExtra !== undefined && this.formData.precioAdultoExtra >= 0 &&
             this.formData.precioNino !== undefined && this.formData.precioNino >= 0 &&
             this.isValidTimeRange());
  }

  isValidTimeRange(): boolean {
    if (!this.formData.horaInicio || !this.formData.horaFin) {
      return false;
    }
    return this.formData.horaFin > this.formData.horaInicio;
  }

  hasTimeRangeError(): boolean {
    return !!(this.formData.horaInicio && this.formData.horaFin &&
             this.formData.horaFin <= this.formData.horaInicio);
  }
}
