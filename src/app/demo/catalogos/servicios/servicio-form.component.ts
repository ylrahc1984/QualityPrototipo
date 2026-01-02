// angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ServiciosService, Servicio } from './servicios.service';

@Component({
  selector: 'app-servicio-form',
  imports: [CommonModule, SharedModule, FormsModule, RouterModule],
  templateUrl: './servicio-form.component.html',
  styleUrls: ['./servicio-form.component.scss']
})
export class ServicioFormComponent implements OnInit {
  servicio: Partial<Servicio> = {};
  isEdit = false;
  title = 'Nuevo Servicio';

  private serviciosService = inject(ServiciosService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.title = 'Editar Servicio';
      const existingServicio = this.serviciosService.getServicioById(+id);
      if (existingServicio) {
        this.servicio = { ...existingServicio };
      }
    } else {
      this.initializeNewServicio();
    }
  }

  initializeNewServicio() {
    this.servicio = {
      nombre: '',
      descripcion: '',
      precio: 0,
      tipo: 'transporte',
      activo: true
    };
  }

  saveServicio() {
    if (this.isEdit && this.servicio.id) {
      this.serviciosService.updateServicio(this.servicio.id, this.servicio);
    } else {
      this.serviciosService.addServicio(this.servicio as Omit<Servicio, 'id'>);
    }
    this.router.navigate(['/servicios']);
  }

  cancel() {
    this.router.navigate(['/servicios']);
  }
}