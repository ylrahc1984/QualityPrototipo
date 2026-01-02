import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { GooglePlaceSelection, GooglePlacesAutocompleteDirective } from './google-places-autocomplete.directive';
import { Reserva, ReservaDetalle, ReservasService } from './reservas.service';

interface ReservaCreateForm {
  numeroBoleta: number;
  fecha: string;
  clienteFinal: string;
  agencia: string;
  idioma: string;
  formaReservacion: string;
  formaPago: string;
  estado: Reserva['estado'];
  comentarios: string;
}

interface DetalleForm {
  id?: number;
  servicio: string;
  fechaServicio: string;
  horaPickup: string;
  horaInicio: string;
  adultos: number;
  ninos: number;
  origenLugar: string;
  origenZona: string;
  origenDireccionGoogle: string;
  origenLat: number;
  origenLng: number;
  origenPlaceId: string;
  destinoLugar: string;
  destinoZona: string;
  destinoDireccionGoogle: string;
  destinoLat: number;
  destinoLng: number;
  destinoPlaceId: string;
  tarifa: string;
  costoNeto: number;
  costoRack: number;
  observaciones?: string;
}

@Component({
  selector: 'app-reserva-create',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule, GooglePlacesAutocompleteDirective],
  templateUrl: './reserva-create.component.html',
  styleUrls: ['./reserva-create.component.scss']
})
export class ReservaCreateComponent implements OnInit {
  form: ReservaCreateForm = this.buildInitialForm();
  detalles: ReservaDetalle[] = [];
  detalleForm: DetalleForm = this.buildDetalleForm();
  showDetalleModal = false;
  editingDetalleId: number | null = null;
  guardado = false;

  idiomas = ['Español', 'Inglés', 'Francés'];
  formasReservacion = ['Correo Electrónico', 'Teléfono', 'WhatsApp', 'Web'];
  formasPago = ['Prepago', 'Crédito', 'Efectivo', 'Transferencia'];
  tarifas = ['A', 'B', 'C', 'D'];
  zonas = ['San Jose', 'Alajuela', 'Monteverde', 'Liberia', 'La Fortuna', 'Tamarindo', 'Sarapiqui'];

  origenAutocompleteMessage = '';
  destinoAutocompleteMessage = '';
  copiedLink: 'origen' | 'destino' | null = null;
  copyError = '';
  copyErrorTarget: 'origen' | 'destino' | null = null;

  private reservasService = inject(ReservasService);
  private router = inject(Router);

  ngOnInit(): void {
    this.resetNumeroBoleta();
  }

  abrirModalDetalle(detalle?: ReservaDetalle): void {
    if (detalle) {
      this.detalleForm = { ...detalle };
      this.editingDetalleId = detalle.id;
    } else {
      this.detalleForm = this.buildDetalleForm();
      this.editingDetalleId = null;
      this.recalcularCosto();
    }
    this.resetAutocompleteState();
    this.showDetalleModal = true;
  }

  cerrarModalDetalle(): void {
    this.resetAutocompleteState();
    this.showDetalleModal = false;
  }

  recalcularCosto(): void {
    const costos = this.reservasService.calculateCosto({
      adultos: this.detalleForm.adultos,
      ninos: this.detalleForm.ninos,
      tarifa: this.detalleForm.tarifa,
      origenZona: this.detalleForm.origenZona,
      destinoZona: this.detalleForm.destinoZona
    });
    this.detalleForm.costoNeto = costos.costoNeto;
    this.detalleForm.costoRack = costos.costoRack;
  }

  onPlaceSelected(tipo: 'origen' | 'destino', selection: GooglePlaceSelection): void {
    if (tipo === 'origen') {
      this.detalleForm.origenDireccionGoogle = selection.formattedAddress;
      this.detalleForm.origenLat = selection.lat;
      this.detalleForm.origenLng = selection.lng;
      this.detalleForm.origenPlaceId = selection.placeId;
      this.origenAutocompleteMessage = '';
    } else {
      this.detalleForm.destinoDireccionGoogle = selection.formattedAddress;
      this.detalleForm.destinoLat = selection.lat;
      this.detalleForm.destinoLng = selection.lng;
      this.detalleForm.destinoPlaceId = selection.placeId;
      this.destinoAutocompleteMessage = '';
    }
    this.copyError = '';
    this.copiedLink = null;
    this.copyErrorTarget = null;
  }

  onPlaceSelectionError(tipo: 'origen' | 'destino', message: string): void {
    const normalizedMessage =
      message || 'Seleccione una opcion del listado de Google para obtener coordenadas.';
    if (tipo === 'origen') {
      this.origenAutocompleteMessage = normalizedMessage;
      this.detalleForm.origenPlaceId = '';
      this.detalleForm.origenLat = 0;
      this.detalleForm.origenLng = 0;
    } else {
      this.destinoAutocompleteMessage = normalizedMessage;
      this.detalleForm.destinoPlaceId = '';
      this.detalleForm.destinoLat = 0;
      this.detalleForm.destinoLng = 0;
    }
    this.copyError = '';
    this.copyErrorTarget = null;
    this.copiedLink = null;
  }

  getMapsLink(tipo: 'origen' | 'destino'): string {
    const lat = tipo === 'origen' ? this.detalleForm.origenLat : this.detalleForm.destinoLat;
    const lng = tipo === 'origen' ? this.detalleForm.origenLng : this.detalleForm.destinoLng;
    if (!this.hasCoordinates(lat, lng)) {
      return '';
    }
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  getDetalleMapsLink(detalle: ReservaDetalle, tipo: 'origen' | 'destino'): string {
    const lat = tipo === 'origen' ? detalle.origenLat : detalle.destinoLat;
    const lng = tipo === 'origen' ? detalle.origenLng : detalle.destinoLng;
    if (!this.hasCoordinates(lat, lng)) {
      return '';
    }
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  async copyMapsLink(tipo: 'origen' | 'destino'): Promise<void> {
    const link = this.getMapsLink(tipo);
    const lat = tipo === 'origen' ? this.detalleForm.origenLat : this.detalleForm.destinoLat;
    const lng = tipo === 'origen' ? this.detalleForm.origenLng : this.detalleForm.destinoLng;
    if (!this.hasCoordinates(lat, lng) || !link) {
      this.copyError = 'Seleccione una opcion del listado de Google para obtener coordenadas.';
      this.copyErrorTarget = tipo;
      this.copiedLink = null;
      return;
    }

    if (!navigator?.clipboard?.writeText) {
      this.copyError = 'Copiado no disponible en este navegador.';
      this.copyErrorTarget = tipo;
      this.copiedLink = null;
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      this.copyError = '';
      this.copyErrorTarget = null;
      this.copiedLink = tipo;
      setTimeout(() => (this.copiedLink = null), 2000);
    } catch {
      this.copyError = 'No se pudo copiar el enlace. Intente manualmente.';
      this.copyErrorTarget = tipo;
      this.copiedLink = null;
    }
  }

  guardarDetalle(detalleFormRef: any): void {
    if (detalleFormRef.invalid) {
      detalleFormRef.control.markAllAsTouched();
      return;
    }
    const baseDetalle: ReservaDetalle = {
      id: this.editingDetalleId ?? this.generateDetalleId(),
      servicio: this.detalleForm.servicio,
      fechaServicio: this.detalleForm.fechaServicio,
      horaPickup: this.detalleForm.horaPickup,
      horaInicio: this.detalleForm.horaInicio,
      adultos: this.detalleForm.adultos,
      ninos: this.detalleForm.ninos,
      origenLugar: this.detalleForm.origenLugar,
      origenZona: this.detalleForm.origenZona,
      origenDireccionGoogle: this.detalleForm.origenDireccionGoogle,
      origenLat: this.detalleForm.origenLat,
      origenLng: this.detalleForm.origenLng,
      origenPlaceId: this.detalleForm.origenPlaceId,
      destinoLugar: this.detalleForm.destinoLugar,
      destinoZona: this.detalleForm.destinoZona,
      destinoDireccionGoogle: this.detalleForm.destinoDireccionGoogle,
      destinoLat: this.detalleForm.destinoLat,
      destinoLng: this.detalleForm.destinoLng,
      destinoPlaceId: this.detalleForm.destinoPlaceId,
      tarifa: this.detalleForm.tarifa,
      costoNeto: this.detalleForm.costoNeto,
      costoRack: this.detalleForm.costoRack,
      observaciones: this.detalleForm.observaciones
    };

    if (this.editingDetalleId) {
      this.detalles = this.detalles.map(d => (d.id === this.editingDetalleId ? baseDetalle : d));
    } else {
      this.detalles = [...this.detalles, baseDetalle];
    }

    this.cerrarModalDetalle();
  }

  editarDetalle(detalle: ReservaDetalle): void {
    this.abrirModalDetalle(detalle);
  }

  eliminarDetalle(detalleId: number): void {
    this.detalles = this.detalles.filter(d => d.id !== detalleId);
  }

  guardarReserva(confirmar = false, formRef?: any): void {
    if (formRef && formRef.invalid) {
      formRef.control.markAllAsTouched();
      return;
    }
    const nuevaReserva: Omit<Reserva, 'id' | 'numeroBoleta' | 'totalNeto' | 'totalRack'> = {
      fecha: this.form.fecha,
      clienteFinal: this.form.clienteFinal,
      agencia: this.form.agencia,
      idioma: this.form.idioma,
      formaReservacion: this.form.formaReservacion,
      formaPago: this.form.formaPago,
      estado: confirmar ? 'Confirmada' : 'Pendiente',
      comentarios: this.form.comentarios,
      detalles: this.detalles
    };

    const created = this.reservasService.createReserva(nuevaReserva);
    this.guardado = true;

    setTimeout(() => {
      this.router.navigate(['/operaciones/reservas', created.id, 'detalle']);
    }, 500);
  }

  cancelar(): void {
    this.router.navigate(['/operaciones/reservas']);
  }

  get totalNeto(): number {
    return this.detalles.reduce((sum, d) => sum + d.costoNeto, 0);
  }

  get totalRack(): number {
    return this.detalles.reduce((sum, d) => sum + d.costoRack, 0);
  }

  get cantidadServicios(): number {
    return this.detalles.length;
  }

  private resetAutocompleteState(): void {
    this.origenAutocompleteMessage = '';
    this.destinoAutocompleteMessage = '';
    this.copiedLink = null;
    this.copyError = '';
    this.copyErrorTarget = null;
  }

  private hasCoordinates(lat?: number, lng?: number): boolean {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      !(lat === 0 && lng === 0)
    );
  }

  private generateDetalleId(): number {
    const ids = this.detalles.map(d => d.id);
    const maxId = ids.length ? Math.max(...ids) : 0;
    return maxId + 1;
  }

  private resetNumeroBoleta(): void {
    this.form.numeroBoleta = this.reservasService.generateNumeroBoleta();
  }

  private buildInitialForm(): ReservaCreateForm {
    const today = new Date().toISOString().split('T')[0];
    return {
      numeroBoleta: 0,
      fecha: today,
      clienteFinal: '',
      agencia: '',
      idioma: 'Español',
      formaReservacion: 'Correo Electrónico',
      formaPago: 'Prepago',
      estado: 'Pendiente',
      comentarios: ''
    };
  }

  private buildDetalleForm(): DetalleForm {
    const today = new Date().toISOString().split('T')[0];
    return {
      servicio: '',
      fechaServicio: today,
      horaPickup: '',
      horaInicio: '',
      adultos: 1,
      ninos: 0,
      origenLugar: '',
      origenZona: '',
      origenDireccionGoogle: '',
      origenLat: 0,
      origenLng: 0,
      origenPlaceId: '',
      destinoLugar: '',
      destinoZona: '',
      destinoDireccionGoogle: '',
      destinoLat: 0,
      destinoLng: 0,
      destinoPlaceId: '',
      tarifa: 'A',
      costoNeto: 0,
      costoRack: 0,
      observaciones: ''
    };
  }
}

