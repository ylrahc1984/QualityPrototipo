import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastAccess: Date;
  notes?: string;
  password?: string;
}

@Component({
  selector: 'app-usuarios-perfiles',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-perfiles.component.html',
  styleUrls: ['./usuarios-perfiles.component.scss']
})
export class UsuariosPerfilesComponent implements OnInit {
  @ViewChild('userModal') userModal!: ElementRef;

  // Propiedades para filtros
  searchTerm: string = '';
  roleFilterValue: string = '';
  statusFilterValue: string = '';

  constructor(private router: Router) {}

  // Datos de usuarios
  users: User[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      role: 'admin',
      status: 'active',
      lastAccess: new Date('2025-12-25T10:30:00'),
      notes: 'Administrador principal del sistema'
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria.garcia@empresa.com',
      role: 'staff',
      status: 'active',
      lastAccess: new Date('2025-12-25T09:15:00'),
      notes: 'Encargada de operaciones'
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@empresa.com',
      role: 'contabilidad',
      status: 'active',
      lastAccess: new Date('2025-12-24T16:45:00'),
      notes: 'Contador senior'
    },
    {
      id: 4,
      name: 'Ana López',
      email: 'ana.lopez@empresa.com',
      role: 'suplidor',
      status: 'inactive',
      lastAccess: new Date('2025-12-20T14:20:00'),
      notes: 'Proveedor de servicios turísticos'
    },
    {
      id: 5,
      name: 'Pedro Martínez',
      email: 'pedro.martinez@empresa.com',
      role: 'staff',
      status: 'active',
      lastAccess: new Date('2025-12-25T11:00:00'),
      notes: 'Asistente de operaciones'
    }
  ];

  filteredUsers: User[] = [];
  currentUser: User = this.getEmptyUser();
  password: string = '';
  confirmPassword: string = '';
  isEditing: boolean = false;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  get totalUsers(): number {
    return this.filteredUsers.length;
  }

  getPaginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  trackByFn(index: number, item: User): number {
    return item.id;
  }

  ngOnInit() {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  getEmptyUser(): User {
    return {
      id: 0,
      name: '',
      email: '',
      role: '',
      status: 'active',
      lastAccess: new Date(),
      notes: ''
    };
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getRoleLabel(role: string): string {
    const roles: { [key: string]: string } = {
      'admin': 'Administrador',
      'staff': 'Staff',
      'contabilidad': 'Contabilidad',
      'suplidor': 'Suplidor'
    };
    return roles[role] || role;
  }

  getRoleBadgeClass(role: string): string {
    const classes: { [key: string]: string } = {
      'admin': 'bg-danger',
      'staff': 'bg-primary',
      'contabilidad': 'bg-success',
      'suplidor': 'bg-warning'
    };
    return classes[role] || 'bg-secondary';
  }

  createNewUser() {
    this.router.navigate(['/usuario-detalle']);
  }

  editUser(user: User) {
    this.router.navigate(['/usuario-detalle'], { queryParams: { id: user.id, edit: true } });
  }

  saveUser() {
    if (this.isEditing) {
      const index = this.users.findIndex(u => u.id === this.currentUser.id);
      if (index !== -1) {
        this.users[index] = { ...this.currentUser };
      }
    } else {
      this.currentUser.id = Math.max(...this.users.map(u => u.id)) + 1;
      this.currentUser.password = this.password; // Asignar contraseña para nuevos usuarios
      this.users.push({ ...this.currentUser });
    }

    this.applyFilters();
    this.closeModal();
    this.password = '';
    this.confirmPassword = '';
  }

  resetPassword(user: User) {
    // Aquí iría la lógica para resetear contraseña
    alert(`Se ha enviado un email de reseteo de contraseña a ${user.email}`);
  }

  toggleUserStatus(user: User) {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    this.applyFilters();
  }

  closeModal() {
    const modal = new (window as any).bootstrap.Modal(this.userModal.nativeElement);
    modal.hide();
  }

  applyFilters() {
    let filtered = [...this.users];

    // Filtro de búsqueda
    if (this.searchTerm) {
      const searchTerm = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro de rol
    if (this.roleFilterValue) {
      filtered = filtered.filter(user => user.role === this.roleFilterValue);
    }

    // Filtro de estado
    if (this.statusFilterValue) {
      filtered = filtered.filter(user => user.status === this.statusFilterValue);
    }

    this.filteredUsers = filtered;
    const total = filtered.length;
    this.totalPages = Math.max(1, Math.ceil(total / this.itemsPerPage));
    this.currentPage = 1;
  }

  getPages(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get Math() {
    return Math;
  }
}
