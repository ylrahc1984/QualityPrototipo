import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-signin',
  imports: [RouterModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent {
  private router = inject(Router);

  onLogin() {
    // Aquí puedes agregar lógica de autenticación si es necesario
    this.router.navigate(['/dashboard']);
  }
}
