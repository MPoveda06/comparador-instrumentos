import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async loginWithGoogle(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      await this.auth.loginWithGoogle();
      this.router.navigate(['/']);
    } catch {
      this.error = 'No se pudo iniciar sesión. Inténtalo de nuevo.';
    } finally {
      this.loading = false;
    }
  }
}
