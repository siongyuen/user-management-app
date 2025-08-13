import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app">
      <h1>User Management App</h1>
      <app-user-management></app-user-management>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      background-color: #f8f9fa;
      padding: 20px;
    }
  `]
})
export class AppComponent {
  title = 'User Management App';
  
  constructor() {
    console.log('AppComponent constructor called');
  }
}
