import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Cliente, TipoCliente } from './clientes.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-cliente-form',
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent {
  @Input() cliente: Cliente | null = null;
  @Input() readOnly: boolean = false;
  @Output() save = new EventEmitter<Cliente>();
  @Output() cancel = new EventEmitter<void>();

  formData: Cliente = this.createEmpty();

  tipoClienteOptions: TipoCliente[] = ['Agencia', 'Comisionista', 'Corporativo'];

  ngOnChanges() {
    this.formData = this.cliente ? { ...this.cliente } : this.createEmpty();
  }

  private createEmpty(): Cliente {
    return {
      codigo: '',
      nombre: '',
      identificacion: '',
      contacto: '',
      direccion: '',
      provincia: '',
      canton: '',
      distrito: '',
      pais: 'Costa Rica',
      zona: '',
      email: '',
      telefono1: '',
      telefono2: '',
      fax: '',
      tipoCliente: 'Agencia',
      tipoInterno: '',
      montoCredito: 0,
      banderaCorreo: true,
      operador: 'Sistema',
      activo: true
    };
  }

  submit(form: NgForm) {
    if (form.valid) {
      const cleaned: Cliente = {
        ...this.formData,
        codigo: this.formData.codigo.trim(),
        nombre: this.formData.nombre.trim(),
        identificacion: this.formData.identificacion.trim(),
        email: this.formData.email?.trim(),
        montoCredito: Number(this.formData.montoCredito || 0),
        telefono1: this.formData.telefono1?.trim(),
        telefono2: this.formData.telefono2?.trim(),
        fax: this.formData.fax?.trim()
      };
      this.save.emit(cleaned);
    }
  }

  cancelForm() {
    this.cancel.emit();
  }
}
