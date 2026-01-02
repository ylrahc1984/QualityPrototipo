// angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ClientesService, Cliente } from './clientes.service';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, SharedModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  showForm = false;
  newCliente: Partial<Cliente> = {};

  private clientesService = inject(ClientesService);

  ngOnInit() {
    this.loadClientes();
  }

  loadClientes() {
    this.clientes = this.clientesService.getClientes();
  }

  openForm() {
    this.showForm = true;
    this.newCliente = {
      nombre: '',
      email: '',
      telefono: '',
      tipo: 'cliente'
    };
  }

  closeForm() {
    this.showForm = false;
  }

  saveCliente() {
    this.clientesService.addCliente(this.newCliente as Omit<Cliente, 'id'>);
    this.loadClientes();
    this.closeForm();
  }

  importarContactos() {
    alert('Función de importar contactos simulada');
  }
}