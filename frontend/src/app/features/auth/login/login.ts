import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';

function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword
    ? null
    : { passwordMismatch: true };
}
@Component({
  imports: [ ReactiveFormsModule ],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
    mode: 'signin' | 'signup' = 'signin';
    
  message = '';
  messageType: 'success' | 'error' = 'success';
    private apiUrl = 'http://localhost:5000/api/user';


  signInForm;
  signUpForm;

showPopup(message: string, type: 'success' | 'error'): void {
  Swal.fire({
    icon: type,
    title: type === 'success' ? 'Success!' : 'Error!',
    text: message,
    confirmButtonText: 'OK',
    confirmButtonColor: '#4f46e5',
    allowOutsideClick: false,
    allowEscapeKey: false
  });
}
  constructor (private fb:FormBuilder,    private http: HttpClient,private router: Router){
        // Sign In form
    this.signInForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

       this.signUpForm = this.fb.nonNullable.group({
        fullName: [
          '',
          [Validators.required, Validators.minLength(2)]
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.minLength(8)]
        ],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: passwordMatchValidator
      }
    );
    


  }
    // Switch between Sign In and Sign Up
  switchMode(mode: 'signin' | 'signup'): void {
    this.mode = mode;
    this.message = '';
  }

  // Handle Sign In form submission
  onSignIn(): void {
    this.message = '';

    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    // Backend authentication will be connected next.
  const { email, password } = this.signInForm.getRawValue();

    this.http.post<any>(`${this.apiUrl}/login`, {
      email,
      password
    }).subscribe({
      next: (response) => {
        // this.message = response.message || 'Login successful!';
        // this.messageType = 'success';
  this.showPopup(
    response.message || 'Login successful!',
    'success'
  );
        if (response.token) {
          localStorage.setItem('token', response.token);
        }    if (response.user) {
          localStorage.setItem('user', response.user.fullName);
               localStorage.setItem('role', response.user.role);
        }

    this.router.navigate(['/dashboard']);
        console.log('Logged-in user:', response.user);
      },
      error: (error) => {
        // this.message =
        //   error.error?.message || 'Login failed. Please try again.';
        // this.messageType = 'error';
         this.showPopup(
    error.error?.message || 'Login failed. Please try again.',
    'error'
  );
      }
    });
  
  }

  // Handle Sign Up form submission
  onSignUp(): void {
    this.message = '';

    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
       const { fullName, email, password, confirmPassword } =
      this.signUpForm.getRawValue();

    if (password !== confirmPassword) {
      this.message = 'Passwords do not match.';
      this.messageType = 'error';
      return;
    }
this.http.post<any>(`${this.apiUrl}/signup`,{  fullName,
      email,
      password}).subscribe({next:(response)=>{  
     this.showPopup(
    response.message || 'Signup successful! Please sign in.',
    'success'
  );

    this.router.navigate(['/dashboard']);
        this.signInForm.patchValue({ email, password: '' });
        this.signUpForm.reset();

},error:(error)=>{
  // this.message=error.error?.message || 'signup Failed.Please try again.'
  //   this.messageType = 'error';
   this.showPopup(
    error.error?.message || 'Login failed. Please try again.',
    'error'
  );
}
  })
}
  }
