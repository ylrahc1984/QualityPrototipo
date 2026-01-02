import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-component.html',
  styleUrls: ['./test-component.scss']
})
export class TestComponentComponent {
  message: string = 'Componente cargado correctamente';

  testFunction(): void {
    this.message = 'Función ejecutada correctamente en ' + new Date().toLocaleString();
  }
}
