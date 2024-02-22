import { Component, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);
  
  user = computed(() => this.authService.currentUser());

  onLogout() {
    this.authService.logout();
  }
  
}
