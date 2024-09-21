import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/apiService/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value).subscribe({
        next: (response: any) => {
          if (response.httpStatus === 'OK') {
            const user = response.user;
            
            // Store user details in local storage
            localStorage.setItem('userId', user.id);
            localStorage.setItem('username', user.username);
            localStorage.setItem('fullName', user.fullName);
            localStorage.setItem('email', user.email);
            this.router.navigate(['/home']);
          } else {
            console.error('Login failed', response.message);
          }
        },
        error: (error: any) => {
          console.error('Login failed', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
