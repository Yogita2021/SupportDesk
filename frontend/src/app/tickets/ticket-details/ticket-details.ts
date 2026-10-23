
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.css'
})
export class TicketDetails implements OnInit {
  ticket: Ticket | null = null;
  loading = true;
  errorMessage = '';

  private apiUrl = 'http://localhost:5000/api/ticket';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const ticketId = this.route.snapshot.paramMap.get('id');

    if (!ticketId) {
      this.errorMessage = 'Ticket ID not found.';
      this.loading = false;
      return;
    }

    this.loadTicket(ticketId);
  }

  loadTicket(ticketId: string): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'Please log in to view ticket details.';
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // Assumes your backend provides GET /api/ticket/:id
    this.http.get<Ticket>(
      `${this.apiUrl}/${ticketId}`,
      { headers }
    ).subscribe({
      next: (response) => {
        this.ticket = response;
        this.loading = false;
               this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Ticket details error:', error);
        this.errorMessage =
          error.error?.message || 'Unable to load ticket details.';
        this.loading = false;
               this.cdr.detectChanges();
      }
    });
  }
}
