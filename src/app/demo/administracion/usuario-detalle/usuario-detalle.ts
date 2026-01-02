import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface UserDetail {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
  birthDate: string;
  address: string;
  city: string;
  country: string;
  documentType: string;
  documentNumber: string;
  emergencyContact: string;
  emergencyPhone: string;
  hireDate: string;
  department: string;
  position: string;
  salary?: number;
  notes: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-usuario-detalle',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-detalle.html',
  styleUrl: './usuario-detalle.scss'
})
export class UsuarioDetalleComponent implements OnInit {
  user: UserDetail = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'staff',
    status: 'active',
    birthDate: '',
    address: '',
    city: '',
    country: 'República Dominicana',
    documentType: 'cedula',
    documentNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    hireDate: '',
    department: '',
    position: '',
    notes: '',
    password: '',
    confirmPassword: ''
  };

  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'staff', label: 'Staff' },
    { value: 'contabilidad', label: 'Contabilidad' },
    { value: 'suplidor', label: 'Suplidor' }
  ];

  documentTypes = [
    { value: 'cedula', label: 'Cédula' },
    { value: 'passport', label: 'Pasaporte' },
    { value: 'license', label: 'Licencia' }
  ];

  countries = [
    'República Dominicana',
    'Estados Unidos',
    'Puerto Rico',
    'México',
    'Colombia',
    'Venezuela',
    'Panamá'
  ];

  departments = [
    'Administración',
    'Ventas',
    'Operaciones',
    'Contabilidad',
    'Tecnología',
    'Recursos Humanos',
    'Marketing'
  ];

  isEditing = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Verificar si viene desde edición
    this.route.queryParams.subscribe(params => {
      if (params['id'] && params['edit']) {
        this.isEditing = true;
        // Aquí iría la lógica para cargar el usuario desde el servicio
        // Por ahora, simulamos con datos de ejemplo
        this.loadUserForEdit(+params['id']);
      }
    });
  }

  loadUserForEdit(userId: number) {
    // Simulación de carga de datos - en un caso real vendría de un servicio
    // Aquí pondrías la lógica para buscar el usuario por ID
    const mockUser = {
      id: userId,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@empresa.com',
      phone: '(809) 123-4567',
      role: 'admin',
      status: 'active' as const,
      birthDate: '1985-06-15',
      address: 'Calle Principal #123',
      city: 'Santo Domingo',
      country: 'República Dominicana',
      documentType: 'cedula',
      documentNumber: '00112345678',
      emergencyContact: 'María Pérez',
      emergencyPhone: '(809) 987-6543',
      hireDate: '2020-01-15',
      department: 'Administración',
      position: 'Gerente General',
      salary: 75000,
      notes: 'Usuario administrador principal del sistema',
      password: '',
      confirmPassword: ''
    };

    this.user = mockUser;
  }

  onSubmit() {
    if (this.isValidForm()) {
      // Aquí iría la lógica para guardar el usuario
      console.log('Usuario a guardar:', this.user);
      alert('Usuario guardado exitosamente');

      // Navegar de vuelta a la lista
      this.goBack();
    }
  }

  isValidForm(): boolean {
    if (!this.user.firstName || !this.user.lastName || !this.user.email) {
      alert('Por favor complete los campos obligatorios');
      return false;
    }

    if (!this.isEditing && (!this.user.password || this.user.password !== this.user.confirmPassword)) {
      alert('Las contraseñas no coinciden o están vacías');
      return false;
    }

    if (!this.user.documentNumber) {
      alert('El número de documento es obligatorio');
      return false;
    }

    return true;
  }

  goBack() {
    this.router.navigate(['/usuarios-perfiles']);
  }

  onPasswordChange() {
    // Validación adicional de contraseña si es necesario
  }
}
