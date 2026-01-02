import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface PaymentMethodDetail {
  id?: number;
  name: string;
  code: string;
  type: 'cash' | 'card' | 'transfer' | 'check' | 'other';
  description: string;
  isActive: boolean;
  requiresReference: boolean;
  maxAmount?: number;
  processingFee?: number;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  cardTypes?: string[];
  minimumAmount?: number;
  currency: string;
  notes: string;
}

@Component({
  selector: 'app-forma-pago-detalle',
  imports: [CommonModule, FormsModule],
  templateUrl: './forma-pago-detalle.html',
  styleUrl: './forma-pago-detalle.scss'
})
export class FormaPagoDetalleComponent implements OnInit {
  paymentMethod: PaymentMethodDetail = {
    name: '',
    code: '',
    type: 'cash',
    description: '',
    isActive: true,
    requiresReference: false,
    currency: 'DOP',
    notes: ''
  };

  paymentTypes = [
    { value: 'cash', label: 'Efectivo', icon: 'dollar-sign' },
    { value: 'card', label: 'Tarjeta', icon: 'credit-card' },
    { value: 'transfer', label: 'Transferencia', icon: 'repeat' },
    { value: 'check', label: 'Cheque', icon: 'file-text' },
    { value: 'other', label: 'Otro', icon: 'more-horizontal' }
  ];

  currencies = [
    { value: 'DOP', label: 'Peso Dominicano (RD$)' },
    { value: 'USD', label: 'Dólar Estadounidense ($)' },
    { value: 'EUR', label: 'Euro (€)' }
  ];

  cardTypes = [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'amex', label: 'American Express' },
    { value: 'discover', label: 'Discover' }
  ];

  selectedCardTypes: string[] = [];
  isEditing = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Verificar si viene desde edición
    this.route.queryParams.subscribe(params => {
      if (params['id'] && params['edit']) {
        this.isEditing = true;
        // Aquí iría la lógica para cargar la forma de pago desde el servicio
        this.loadPaymentMethodForEdit(+params['id']);
      }
    });
  }

  loadPaymentMethodForEdit(id: number) {
    // Simulación de carga de datos - en un caso real vendría de un servicio
    const mockMethod = {
      id: id,
      name: 'Tarjeta de Crédito Visa',
      code: 'VISA',
      type: 'card' as const,
      description: 'Pago con tarjeta de crédito Visa',
      isActive: true,
      requiresReference: true,
      maxAmount: 50000,
      processingFee: 2.9,
      bankName: 'Banco Popular',
      currency: 'DOP',
      cardTypes: ['visa', 'mastercard'],
      minimumAmount: 100,
      notes: 'Acepta tarjetas Visa y Mastercard con procesamiento inmediato'
    };

    this.paymentMethod = mockMethod;
    this.selectedCardTypes = mockMethod.cardTypes || [];
  }

  onSubmit() {
    if (this.isValidForm()) {
      // Asignar los tipos de tarjeta seleccionados
      if (this.paymentMethod.type === 'card') {
        this.paymentMethod.cardTypes = this.selectedCardTypes;
      }

      // Aquí iría la lógica para guardar la forma de pago
      console.log('Forma de pago a guardar:', this.paymentMethod);
      alert(`Forma de pago ${this.isEditing ? 'actualizada' : 'creada'} exitosamente`);

      // Navegar de vuelta a la lista
      this.goBack();
    }
  }

  isValidForm(): boolean {
    if (!this.paymentMethod.name || !this.paymentMethod.code || !this.paymentMethod.description) {
      alert('Por favor complete los campos obligatorios marcados con *');
      return false;
    }

    if (this.paymentMethod.type === 'card' && this.selectedCardTypes.length === 0) {
      alert('Debe seleccionar al menos un tipo de tarjeta');
      return false;
    }

    if (this.paymentMethod.type === 'transfer' && (!this.paymentMethod.bankName || !this.paymentMethod.accountNumber)) {
      alert('Para transferencias debe completar los datos bancarios');
      return false;
    }

    return true;
  }

  goBack() {
    this.router.navigate(['/formas-pago']);
  }

  onTypeChange() {
    // Resetear campos específicos según el tipo
    if (this.paymentMethod.type !== 'card') {
      this.paymentMethod.processingFee = undefined;
      this.paymentMethod.maxAmount = undefined;
      this.selectedCardTypes = [];
    }

    if (this.paymentMethod.type !== 'transfer') {
      this.paymentMethod.bankName = undefined;
      this.paymentMethod.accountNumber = undefined;
      this.paymentMethod.routingNumber = undefined;
    }

    // Configuraciones por defecto según tipo
    switch (this.paymentMethod.type) {
      case 'cash':
        this.paymentMethod.requiresReference = false;
        break;
      case 'card':
      case 'transfer':
      case 'check':
        this.paymentMethod.requiresReference = true;
        break;
    }
  }

  toggleCardType(cardType: string) {
    const index = this.selectedCardTypes.indexOf(cardType);
    if (index > -1) {
      this.selectedCardTypes.splice(index, 1);
    } else {
      this.selectedCardTypes.push(cardType);
    }
  }

  isCardTypeSelected(cardType: string): boolean {
    return this.selectedCardTypes.includes(cardType);
  }

  formatCurrency(amount: number): string {
    const currency = this.paymentMethod.currency || 'DOP';
    const locale = currency === 'DOP' ? 'es-DO' : 'en-US';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}
