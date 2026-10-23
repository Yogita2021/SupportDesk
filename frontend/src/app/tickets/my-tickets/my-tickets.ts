
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css'
})
export class MyTickets implements OnInit {

  tickets: Ticket[] = [];
  loading = false;
  errorMessage = '';

  private apiUrl = 'http://localhost:5000/api/ticket/get';

  constructor(private http: HttpClient,  private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTickets();
  }


loadTickets(): void {
  console.log('Loading tickets started');

  this.loading = true;
  this.errorMessage = '';

  const token = localStorage.getItem('token');

  if (!token) {
    this.loading = false;
    this.errorMessage = 'Please log in to view your tickets.';
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.http.get<{ message: string; tickets: Ticket[] }>(
    this.apiUrl,
    { headers }
  ).subscribe({
    next: (response) => {
      console.log('API response:', response);

      this.tickets = response?.tickets ?? [];
      this.loading = false;
  this.cdr.detectChanges();
 console.log('Component instance:', this);
  console.log('Tickets count:', this.tickets.length);
  console.log('Loading after update:', this.loading);
      console.log('Tickets count:', this.tickets.length);
    },
    error: (error) => {
      console.error('API error:', error);

      this.tickets = [];
      this.loading = false;
      this.errorMessage =
        error.error?.message || 'Unable to load tickets.';
          this.cdr.detectChanges();


    }

  });
}

  get openCount(): number {
    return this.tickets.filter(
      ticket => ticket.status === 'Open'
    ).length;
  }

  get inProgressCount(): number {
    return this.tickets.filter(
      ticket => ticket.status === 'In Progress'
    ).length;
  }

  get resolvedCount(): number {
    return this.tickets.filter(
      ticket =>
        ticket.status === 'Resolved' ||
        ticket.status === 'Closed'
    ).length;
  }

}
