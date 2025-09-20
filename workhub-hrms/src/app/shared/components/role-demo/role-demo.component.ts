import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/user.model';

@Component({
  selector: 'app-role-demo',
  templateUrl: './role-demo.component.html',
  styleUrls: ['./role-demo.component.scss']
})
export class RoleDemoComponent {
  Role = Role; // Make Role enum available to the template
  
  constructor(public authService: AuthService) {}
  
  // Actions to demonstrate role-based permissions
  performAdminAction(): void {
    alert('Admin action performed!');
  }
  
  performHRAction(): void {
    alert('HR action performed!');
  }
  
  performManagerAction(): void {
    alert('Manager action performed!');
  }
  
  performEmployeeAction(): void {
    alert('Employee action performed!');
  }
}
