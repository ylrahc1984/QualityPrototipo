import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Moneda, CurrencyFormat } from './moneda.model';

declare var bootstrap: any;

@Component({
  selector: 'app-monedas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monedas.component.html',
  styleUrls: ['./monedas.component.scss']
})
export class MonedasComponent implements OnInit {
  monedas: Moneda[] = [];
  filteredMonedas: Moneda[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  isEditing: boolean = false;
  currentMoneda: Moneda | null = null;

  @ViewChild('monedaModal') monedaModal!: ElementRef;
  @ViewChild('monedaForm') monedaForm!: NgForm;

  // Opciones de decimales
  decimalOptions: { value: number; label: string }[] = [
    { value: 0, label: 'Sin decimales (ej: ¥100)' },
    { value: 2, label: '2 decimales (ej: $100.00)' },
    { value: 3, label: '3 decimales (ej: $100.000)' },
    { value: 4, label: '4 decimales (ej: $100.0000)' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMonedas();
  }

  loadMonedas(): void {
    // Datos de ejemplo - en producción vendrían de un servicio
    this.monedas = [
      {
        id: '1',
        code: 'DOP',
        name: 'Peso Dominicano',
        symbol: 'RD$',
        decimalPlaces: 2,
        isActive: true,
        isBaseCurrency: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-25')
      },
      {
        id: '2',
        code: 'USD',
        name: 'Dólar Estadounidense',
        symbol: '$',
        decimalPlaces: 2,
        isActive: true,
        isBaseCurrency: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-20')
      },
      {
        id: '3',
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        decimalPlaces: 2,
        isActive: true,
        isBaseCurrency: false,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-15')
      },
      {
        id: '4',
        code: 'JPY',
        name: 'Yen Japonés',
        symbol: '¥',
        decimalPlaces: 0,
        isActive: false,
        isBaseCurrency: false,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-11-30')
      },
      {
        id: '5',
        code: 'GBP',
        name: 'Libra Esterlina',
        symbol: '£',
        decimalPlaces: 2,
        isActive: true,
        isBaseCurrency: false,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-12-10')
      }
    ];
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredMonedas = this.monedas.filter(moneda => {
      const matchesSearch = !this.searchTerm ||
        moneda.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        moneda.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        moneda.symbol.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.statusFilter ||
        (this.statusFilter === 'active' && moneda.isActive) ||
        (this.statusFilter === 'inactive' && !moneda.isActive);

      return matchesSearch && matchesStatus;
    });
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  getPaginatedMonedas(): Moneda[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredMonedas.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMonedas.length / this.itemsPerPage);
  }

  get totalMonedas(): number {
    return this.filteredMonedas.length;
  }

  get isFormValid(): boolean {
    return this.monedaForm ? this.monedaForm.valid : false;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getDecimalLabel(decimalPlaces: number): string {
    const option = this.decimalOptions.find(d => d.value === decimalPlaces);
    return option ? option.label : `${decimalPlaces} decimales`;
  }

  generatePreview(moneda: Moneda): string {
    const amount = 1234.56;
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: moneda.code,
      minimumFractionDigits: moneda.decimalPlaces,
      maximumFractionDigits: moneda.decimalPlaces
    }).format(amount).replace(moneda.code, moneda.symbol);
  }

  createNewMoneda(): void {
    this.currentMoneda = {
      id: '',
      code: '',
      name: '',
      symbol: '',
      decimalPlaces: 2,
      isActive: true,
      isBaseCurrency: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.isEditing = false;
    this.openModal();
  }

  editMoneda(moneda: Moneda): void {
    this.currentMoneda = { ...moneda };
    this.isEditing = true;
    this.openModal();
  }

  deleteMoneda(moneda: Moneda): void {
    if (confirm(`¿Está seguro de que desea eliminar la moneda "${moneda.name}"?`)) {
      this.monedas = this.monedas.filter(m => m.id !== moneda.id);
      this.applyFilters();
    }
  }

  saveMoneda(): void {
    if (!this.currentMoneda || !this.isFormValid) return;

    const monedaToSave = {
      ...this.currentMoneda,
      updatedAt: new Date()
    };

    if (this.isEditing) {
      // Actualizar moneda existente
      const index = this.monedas.findIndex(m => m.id === this.currentMoneda!.id);
      if (index !== -1) {
        this.monedas[index] = monedaToSave;
      }
    } else {
      // Crear nueva moneda
      monedaToSave.id = Date.now().toString();
      monedaToSave.createdAt = new Date();
      this.monedas.push(monedaToSave);
    }

    this.applyFilters();
    this.closeModal();
  }

  toggleStatus(moneda: Moneda): void {
    const newStatus = !moneda.isActive;
    const action = newStatus ? 'activar' : 'desactivar';

    if (confirm(`¿Está seguro de que desea ${action} la moneda "${moneda.name}"?`)) {
      moneda.isActive = newStatus;
      moneda.updatedAt = new Date();
      this.applyFilters();
    }
  }

  setAsBaseCurrency(moneda: Moneda): void {
    if (moneda.isBaseCurrency) return;

    if (confirm(`¿Está seguro de que desea establecer "${moneda.name}" como la moneda base? Esto cambiará la configuración actual.`)) {
      // Desactivar la moneda base actual
      this.monedas.forEach(m => m.isBaseCurrency = false);
      // Establecer la nueva moneda base
      moneda.isBaseCurrency = true;
      moneda.updatedAt = new Date();
      this.applyFilters();
    }
  }

  private openModal(): void {
    if (this.monedaModal) {
      const modal = new bootstrap.Modal(this.monedaModal.nativeElement);
      modal.show();
    }
  }

  private closeModal(): void {
    if (this.monedaModal) {
      const modal = bootstrap.Modal.getInstance(this.monedaModal.nativeElement);
      if (modal) {
        modal.hide();
      }
    }
    this.currentMoneda = null;
    this.isEditing = false;
  }

  // Métodos de navegación
  goToPageRelative(offset: number): void {
    this.goToPage(this.currentPage + offset);
  }

  getVisiblePages(): number[] {
    const totalPages = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }

  trackByFn(index: number, item: Moneda): string {
    return item.id;
  }
}
