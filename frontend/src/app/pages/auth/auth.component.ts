import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="display:flex; justify-content:center; align-items:center; height:100vh; background:#f6f8fa;">
      <div class="card" style="width:400px;">
        <h1 style="margin-bottom:0.5rem">⚡ Safebase</h1>
        <p style="color:#57606a; margin-bottom:1.5rem; font-size:0.875rem">
          {{ isLogin ? 'Sign in to your account' : 'Create an account' }}
        </p>

        <form (ngSubmit)="submit()">
          <div class="form-grid" style="grid-template-columns: 1fr;">
            <input
              [(ngModel)]="form.email"
              name="email"
              type="email"
              placeholder="Email"
              required
            />
            <input
              [(ngModel)]="form.password"
              name="password"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" class="btn-primary" style="width:100%; margin-top:0.5rem;">
            {{ isLogin ? 'Sign in' : 'Create account' }}
          </button>
        </form>

        <p *ngIf="message" class="message" [class.error]="isError">{{ message }}</p>

        <p style="margin-top:1rem; font-size:0.875rem; color:#57606a; text-align:center;">
          {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
          <a href="#" (click)="toggle($event)" style="color:#0969da;">
            {{ isLogin ? 'Register' : 'Sign in' }}
          </a>
        </p>
      </div>
    </div>
  `
})
export class AuthComponent {
  isLogin = true
  isError = false
  message = ''

  form = { email: '', password: '' }

  constructor(private api: ApiService, private router: Router) {}

  toggle(e: Event) {
    e.preventDefault()
    this.isLogin = !this.isLogin
    this.message = ''
  }

  submit() {
    const call = this.isLogin
      ? this.api.login(this.form)
      : this.api.register(this.form)

    call.subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token)
        this.router.navigate(['/databases'])
      },
      error: (err) => {
        this.isError = true
        this.message = err.error.message || 'Something went wrong'
      }
    })
  }
}