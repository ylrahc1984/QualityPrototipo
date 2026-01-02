import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  type: 'cash' | 'card' | 'transfer' | 'check' | 'other';
  description: string;
  isActive: boolean;
  requiresReference: boolean;
  maxAmount?: number;
  processingFee?: number;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-formas-pago',
  imports: [CommonModule, FormsModule],
  templateUrl: './formas-pago.component.html',
  styleUrls: ['./formas-pago.component.scss']
})
export class FormasPagoComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('typeFilter') typeFilter!: ElementRef;
  @ViewChild('statusFilter') statusFilter!: ElementRef;

  constructor(private router: Router) {}

  // Datos de formas de pago
  paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      name: 'Efectivo',
      code: 'CASH',
      type: 'cash',
      description: 'Pago en efectivo',
      isActive: true,
      requiresReference: false,
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15')
    },
    {
      id: 2,
      name: 'Tarjeta de Crédito',
      code: 'CREDIT',
      type: 'card',
      description: 'Pago con tarjeta de crédito Visa/Mastercard',
      isActive: true,
      requiresReference: true,
      processingFee: 2.5,
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15')
    },
    {
      id: 3,
      name: 'Transferencia Bancaria',
      code: 'BANK',
      type: 'transfer',
      description: 'Transferencia bancaria directa',
      isActive: true,
      requiresReference: true,
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15')
    },
    {
      id: 4,
      name: 'Cheque',
      code: 'CHECK',
      type: 'check',
      description: 'Pago mediante cheque bancario',
      isActive: false,
      requiresReference: true,
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-12-20')
    },
    {
      id: 5,
      name: 'Tarjeta de Débito',
      code: 'DEBIT',
      type: 'card',
      description: 'Pago con tarjeta de débito',
      isActive: true,
      requiresReference: true,
      processingFee: 1.2,
      createdAt: new Date('2025-02-01'),
      updatedAt: new Date('2025-02-01')
    }
  ];

  filteredMethods: PaymentMethod[] = [];

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalMethods: number = 0;
  totalPages: number = 0;

  // Filtros
  searchTerm: string = '';
  typeFilterValue: string = '';
  statusFilterValue: string = '';

  paymentTypes = [
    { value: 'cash', label: 'Efectivo' },
    { value: 'card', label: 'Tarjeta' },
    { value: 'transfer', label: 'Transferencia' },
    { value: 'check', label: 'Cheque' },
    { value: 'other', label: 'Otro' }
  ];

  ngOnInit() {
    this.filteredMethods = [...this.paymentMethods];
    this.totalMethods = this.paymentMethods.length;
    this.totalPages = Math.ceil(this.totalMethods / this.itemsPerPage);
  }

  getTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      'cash': 'Efectivo',
      'card': 'Tarjeta',
      'transfer': 'Transferencia',
      'check': 'Cheque',
      'other': 'Otro'
    };
    return types[type] || type;
  }

  getTypeBadgeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'cash': 'bg-success',
      'card': 'bg-primary',
      'transfer': 'bg-info',
      'check': 'bg-warning',
      'other': 'bg-secondary'
    };
    return classes[type] || 'bg-secondary';
  }

  createNewMethod() {
    this.router.navigate(['/forma-pago-detalle']);
  }

  editMethod(method: PaymentMethod) {
    this.router.navigate(['/forma-pago-detalle'], { queryParams: { id: method.id, edit: true } });
  }

  toggleMethodStatus(method: PaymentMethod) {
    method.isActive = !method.isActive;
    method.updatedAt = new Date();
    this.applyFilters();
  }

  deleteMethod(method: PaymentMethod) {
    if (confirm(`¿Está seguro de eliminar la forma de pago "${method.name}"?`)) {
      const index = this.paymentMethods.findIndex(m => m.id === method.id);
      if (index !== -1) {
        this.paymentMethods.splice(index, 1);
        this.applyFilters();
      }
    }
  }

  applyFilters() {
    let filtered = [...this.paymentMethods];

    // Filtro de búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter(method =>
        method.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        method.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        method.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo
    if (this.typeFilterValue) {
      filtered = filtered.filter(method => method.type === this.typeFilterValue);
    }

    // Filtro por estado
    if (this.statusFilterValue) {
      const isActive = this.statusFilterValue === 'active';
      filtered = filtered.filter(method => method.isActive === isActive);
    }

    this.filteredMethods = filtered;
    this.totalMethods = filtered.length;
    this.totalPages = Math.ceil(this.totalMethods / this.itemsPerPage);
    this.currentPage = 1;
  }

  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  getPaginatedMethods(): PaymentMethod[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredMethods.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
}
