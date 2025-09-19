import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  template: '<div class="register-container"><h2>Register Component</h2><p>Registration form will be implemented here</p></div>',
  styles: [`
    .register-container {
      padding: 20px;
      max-width: 500px;
      margin: 0 auto;
      text-align: center;
    }
  `]
})
export class RegisterComponent {
  constructor() {}
}
