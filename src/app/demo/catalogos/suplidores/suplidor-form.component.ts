import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Suplidor, TipoSuplidor } from './suplidores.service';

@Component({
  selector: 'app-suplidor-form',
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './suplidor-form.component.html',
  styleUrls: ['./suplidor-form.component.scss']
})
export class SuplidorFormComponent implements OnChanges {
  @Input() suplidor: Suplidor | null = null;
  @Input() readOnly = false;
  @Output() save = new EventEmitter<Suplidor>();
  @Output() cancel = new EventEmitter<void>();

  formData: Suplidor = this.createEmpty();
  tipoOptions: TipoSuplidor[] = ['Transportista', 'Guía', 'Empresa', 'Otro'];
  servicioOptions = ['Transporte Hotel-Hotel', 'Transporte Privado', 'Tours'];
  formaPagoOptions = ['Transferencia', 'Efectivo', 'Cheque'];
  monedaOptions = ['CRC', 'USD'];
  servicesWarning = false;

  ngOnChanges() {
    this.formData = this.suplidor ? { ...this.createEmpty(), ...this.suplidor } : this.createEmpty();
    this.servicesWarning = false;
  }

  private createEmpty(): Suplidor {
    return {
      codigo: '',
      nombre: '',
      identificacion: '',
      tipoSuplidor: 'Transportista',
      contacto: '',
      email: '',
      telefono1: '',
      telefono2: '',
      direccion: '',
      provincia: '',
      canton: '',
      distrito: '',
      servicios: [],
      observaciones: '',
      activo: true,
      formaPagoPreferida: 'Transferencia',
      monedaPago: 'CRC',
      condicionesEspeciales: ''
    };
  }

  toggleServicio(servicio: string, checked: boolean) {
    const selected = new Set(this.formData.servicios);
    if (checked) {
      selected.add(servicio);
    } else {
      selected.delete(servicio);
    }
    this.formData = { ...this.formData, servicios: Array.from(selected) };
    if (this.formData.servicios.length) {
      this.servicesWarning = false;
    }
  }

  submit(form: NgForm) {
    this.servicesWarning = this.formData.servicios.length === 0;
    if (form.valid) {
      const cleaned: Suplidor = {
        ...this.formData,
        codigo: this.formData.codigo.trim(),
        nombre: this.formData.nombre.trim(),
        identificacion: this.formData.identificacion.trim(),
        contacto: this.formData.contacto?.trim(),
        email: this.formData.email?.trim(),
        telefono1: this.formData.telefono1?.trim(),
        telefono2: this.formData.telefono2?.trim(),
        direccion: this.formData.direccion?.trim(),
        provincia: this.formData.provincia?.trim(),
        canton: this.formData.canton?.trim(),
        distrito: this.formData.distrito?.trim(),
        observaciones: this.formData.observaciones?.trim(),
        formaPagoPreferida: this.formData.formaPagoPreferida?.trim(),
        monedaPago: this.formData.monedaPago?.trim(),
        condicionesEspeciales: this.formData.condicionesEspeciales?.trim()
      };
      this.save.emit(cleaned);
    }
  }

  cancelForm() {
    this.cancel.emit();
  }
}
