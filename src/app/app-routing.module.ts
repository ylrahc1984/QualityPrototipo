import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: GuestComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/pages/authentication/auth-signin/auth-signin.component').then((c) => c.AuthSigninComponent)
      }
    ]
  },
  {
    path: 'register',
    component: GuestComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/pages/authentication/auth-signup/auth-signup.component').then((c) => c.AuthSignupComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    component: AdminComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      }
    ]
  },
  {
    path: 'operaciones',
    component: AdminComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'reservas',
        loadComponent: () => import('./demo/reservas/reservas.component').then((c) => c.ReservasComponent)
      },
      {
        path: 'ordenes-trabajo',
        loadComponent: () => import('./demo/ordenes/ordenes.component').then((c) => c.OrdenesComponent)
      },
      {
        path: 'ordenes-trabajo/nueva',
        loadComponent: () => import('./demo/ordenes/orden-trabajo-form.component').then((c) => c.OrdenTrabajoFormComponent)
      },
      {
        path: 'ordenes-trabajo/:id/editar',
        loadComponent: () => import('./demo/ordenes/orden-trabajo-form.component').then((c) => c.OrdenTrabajoFormComponent)
      },
      {
        path: 'reservas/nueva',
        loadComponent: () => import('./demo/reservas/reserva-create.component').then((c) => c.ReservaCreateComponent)
      },
      {
        path: 'reservas/:id/detalle',
        loadComponent: () => import('./demo/reservas/reserva-detalle.component').then((c) => c.ReservaDetalleComponent)
      }
    ]
  },
  {
    path: 'reservas',
    redirectTo: 'operaciones/reservas',
    pathMatch: 'full'
  },
  {
    path: 'ordenes-trabajo',
    redirectTo: 'operaciones/ordenes-trabajo',
    pathMatch: 'full'
  },
  {
    path: 'ordenes-trabajo/nueva',
    redirectTo: 'operaciones/ordenes-trabajo/nueva',
    pathMatch: 'full'
  },
  {
    path: 'ordenes-trabajo/:id/editar',
    redirectTo: 'operaciones/ordenes-trabajo/:id/editar',
    pathMatch: 'full'
  },
  {
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    path: 'clientes',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/clientes/clientes.component').then((c) => c.ClientesComponent)
      }
    ]
  },
  {
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    path: 'cuentas-cobrar',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/contabilidad/cuentas-cobrar/cuentas-cobrar.component').then((c) => c.CuentasCobrarComponent)
      }
    ]
  },
  {
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    path: 'cuentas-pagar',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/contabilidad/cuentas-pagar/cuentas-pagar.component').then((c) => c.CuentasPagarComponent)
      }
    ]
  },
  {
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    path: 'facturas',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/contabilidad/facturas/facturas.component').then((c) => c.FacturasComponent)
      },
      {
        path: 'nueva',
        loadComponent: () => import('./demo/contabilidad/facturas/factura-form.component').then((c) => c.FacturaFormComponent)
      }
    ]
  },
  {
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    path: 'servicios',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/catalogos/servicios/servicios.component').then((c) => c.ServiciosComponent)
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./demo/catalogos/servicios/servicio-form.component').then((c) => c.ServicioFormComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./demo/catalogos/servicios/servicio-form.component').then((c) => c.ServicioFormComponent)
      }
    ]
  },
  {
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    path: 'catalogos',
    component: AdminComponent,
    children: [
      {
        path: 'listas-precios',
        loadComponent: () => import('./demo/catalogos/listas-precios/listas-precios.component').then((c) => c.ListasPreciosComponent)
      },
      {
        path: 'listas-precios/nuevo',
        loadComponent: () => import('./demo/catalogos/listas-precios/lista-precio-form.component').then((c) => c.ListaPrecioFormComponent)
      },
      {
        path: 'listas-precios/:id/editar',
        loadComponent: () => import('./demo/catalogos/listas-precios/lista-precio-form.component').then((c) => c.ListaPrecioFormComponent)
      },
      {
        path: 'listas-precios/:id/detalle',
        loadComponent: () => import('./demo/catalogos/listas-precios/lista-precio-detalle.component').then((c) => c.ListaPrecioDetalleComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./demo/catalogos/agencias-comisionistas/agencias-comisionistas.component').then((c) => c.AgenciasComisionistasComponent)
      },
      {
        path: 'suplidores',
        loadComponent: () => import('./demo/catalogos/suplidores/suplidores.component').then((c) => c.SuplidoresComponent)
      }
    ]
  },
  {
    path: 'agencias-comisionistas',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/catalogos/agencias-comisionistas/agencias-comisionistas.component').then((c) => c.AgenciasComisionistasComponent)
      }
    ]
  },
  {
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    path: 'suplidores',
    redirectTo: 'catalogos/suplidores',
    pathMatch: 'full'
  },
  {
    path: 'usuarios-perfiles',
    component: AdminComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/administracion/usuarios-perfiles/usuarios-perfiles.component').then((c) => c.UsuariosPerfilesComponent)
      }
    ]
  },
  {
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    path: 'usuario-detalle',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/administracion/usuario-detalle/usuario-detalle').then((c) => c.UsuarioDetalleComponent)
      }
    ]
  },
  {
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    path: 'formas-pago',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/administracion/formas-pago/formas-pago.component').then((c) => c.FormasPagoComponent)
      }
    ]
  },
  {
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    path: 'forma-pago-detalle',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/administracion/forma-pago-detalle/forma-pago-detalle').then((c) => c.FormaPagoDetalleComponent)
     }
    ]
  },
  {
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    path: 'correlativos',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/administracion/correlativos/correlativos.component').then((c) => c.CorrelativosComponent)
      }
    ]
  },
  {
    path: 'monedas',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/administracion/monedas/monedas.component').then((c) => c.MonedasComponent)
      }
    ]
  },
  {
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    path: 'tipo-cambio',
    redirectTo: 'administracion/tipo-cambio',
    pathMatch: 'full'
  },
  {
    path: 'recibos',
    component: AdminComponent,
    children: [
      {
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        path: '',
        loadComponent: () => import('./demo/contabilidad/recibos/recibos.component').then((c) => c.RecibosComponent)
      }
    ]
  },
  {
    path: 'administracion',
    component: AdminComponent,
    children: [
      {
        path: 'tipo-cambio',
        loadComponent: () => import('./demo/administracion/tipo-cambio/tipo-cambio.component').then((c) => c.TipoCambioComponent)
      }
    ]
  },
  {
    path: 'reportes',
    component: AdminComponent,
    children: [
      {
        path: 'ventas',
        loadComponent: () => import('./demo/reportes/ventas/ventas.component').then((c) => c.VentasComponent)
      },
      {
        path: 'reservas',
        loadComponent: () => import('./demo/reportes/reservas/reservas.component').then((c) => c.ReservasComponent)
      },
      {
        path: 'ingresos',
        loadComponent: () => import('./demo/reportes/ingresos/ingresos.component').then((c) => c.IngresosComponent)
      },
      {
        path: 'comisiones',
        loadComponent: () => import('./demo/reportes/comisiones/comisiones.component').then((c) => c.ComisionesComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
