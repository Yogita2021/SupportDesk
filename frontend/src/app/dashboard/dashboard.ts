
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { RouterLink } from '@angular/router';

interface DashboardTicket {
  _id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface DashboardResponse {
  message: string;
  summary: {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
  };
  recentTickets: DashboardTicket[];
  recentActivity: DashboardTicket[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  loading = true;
  errorMessage = '';

  summary = {
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0
  };

  recentTickets: DashboardTicket[] = [];
  recentActivity: DashboardTicket[] = [];

  private apiUrl = 'http://localhost:5000/api/dashboard/data';

  constructor(private http: HttpClient,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'Please log in to view your dashboard.';
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<DashboardResponse>(this.apiUrl, { headers }).subscribe({
      next: (response) => {
        this.summary = response.summary;
        this.recentTickets = response.recentTickets || [];
        this.recentActivity = response.recentActivity || [];
        this.loading = false;
           this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Dashboard API error:', error);
        this.errorMessage =
          error.error?.message || 'Unable to load dashboard.';
        this.loading = false;
           this.cdr.detectChanges();
      }
    });
  }

  get openPercent(): number {
    return this.percentage(this.summary.openTickets);
  }

  get progressPercent(): number {
    return this.percentage(this.summary.inProgressTickets);
  }

  get resolvedPercent(): number {
    return this.percentage(this.summary.resolvedTickets);
  }

  private percentage(value: number): number {
    if (!this.summary.totalTickets) return 0;
    return (value / this.summary.totalTickets) * 100;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/[\s_]+/g, '-');
  }
}
