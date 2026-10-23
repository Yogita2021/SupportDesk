import { Component } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-create-ticket',
  styleUrl: './create-ticket.css',
  templateUrl: './create-ticket.html',
})
export class CreateTicket {
  private apiUrl = 'http://localhost:5000/api/ticket/create';
  isSubmitting = false;

  ticketForm;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.ticketForm = this.fb.nonNullable.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['', Validators.required],
      priority: ['Medium', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();

      await Swal.fire({
        icon: 'warning',
        title: 'Required fields',
        text: 'Please complete all required fields correctly.',
        confirmButtonText: 'OK',
        allowOutsideClick: false
      });

      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      await Swal.fire({
        icon: 'error',
        title: 'Login required',
        text: 'Please log in before creating a ticket.',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.isSubmitting = true;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post<any>(
      this.apiUrl,
      this.ticketForm.getRawValue(),
      { headers }
    ).subscribe({
      next: async (response) => {
        console.log("response--->",response)
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.message || 'Ticket created successfully.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3158d9',
          allowOutsideClick: false,
          allowEscapeKey: false
        });

        this.ticketForm.reset({
          title: '',
          category: '',
          priority: 'Medium',
          description: ''
        });

        this.isSubmitting = false;
      },
      error: async (error) => {
        await Swal.fire({
          icon: 'error',
          title: 'Unable to create ticket',
          text: error.error?.message ||
            'Something went wrong. Please try again.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3158d9',
          allowOutsideClick: false,
          allowEscapeKey: false
        });

        this.isSubmitting = false;
      }
    });
  }

  onReset(): void {
    this.ticketForm.reset({
      title: '',
      category: '',
      priority: 'Medium',
      description: ''
    });
  }
}
