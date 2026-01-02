import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ReservasService } from '../reservas/reservas.service';
import { OrdenesService } from '../ordenes/ordenes.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  reservasDia = 0;
  reservasPendientes = 0;
  ordenesActivas = 0;
  ingresosEstimados = 0;

  sales = [
    {
      title: 'Reservas del Dia',
      amount: '0',
      percentage: '+0%',
      progress: 0,
      progress_bg: 'bg-c-blue',
      icon: 'icon-calendar',
      design: 'col-xl-3 col-md-6'
    },
    {
      title: 'Reservas Pendientes',
      amount: '0',
      percentage: '0%',
      progress: 0,
      progress_bg: 'bg-c-green',
      icon: 'icon-clock',
      design: 'col-xl-3 col-md-6'
    },
    {
      title: 'Ordenes Activas',
      amount: '0',
      percentage: '0%',
      progress: 0,
      progress_bg: 'bg-c-yellow',
      icon: 'icon-clipboard',
      design: 'col-xl-3 col-md-6'
    },
    {
      title: 'Ingresos Estimados',
      amount: 'CRC 0',
      percentage: '+0%',
      progress: 0,
      progress_bg: 'bg-c-red',
      icon: 'icon-dollar-sign',
      design: 'col-xl-3 col-md-6'
    }
  ];

  private reservasService = inject(ReservasService);
  private ordenesService = inject(OrdenesService);

  ngOnInit() {
    this.calculateMetrics();
  }

  calculateMetrics() {
    const reservas = this.reservasService.getReservas();
    const ordenes = this.ordenesService.getOrdenes();
    const today = new Date().toISOString().split('T')[0];

    this.reservasDia = reservas.filter(r => r.fecha === today).length;
    this.reservasPendientes = reservas.filter(r => r.estado === 'Pendiente' || r.estado === 'Confirmada').length;
    this.ordenesActivas = ordenes.filter(o => o.estado !== 'Finalizada' && o.estado !== 'Anulada').length;
    this.ingresosEstimados = reservas.filter(r => r.estado !== 'Cancelada').reduce((sum, r) => sum + r.totalNeto, 0);

    this.sales[0].amount = this.reservasDia.toString();
    this.sales[1].amount = this.reservasPendientes.toString();
    this.sales[2].amount = this.ordenesActivas.toString();
    this.sales[3].amount = `CRC ${this.ingresosEstimados.toLocaleString()}`;
  }
}
