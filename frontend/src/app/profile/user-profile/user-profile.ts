import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
  isLoading = true;
  errorMessage = '';

  profile: any = {
    fullName: '',
    email: '',
    role: 'User'
  };

  private apiUrl = 'http://localhost:5000/api/profile/get';

  constructor(private http: HttpClient,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.errorMessage = 'Token not found';
      this.isLoading = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>(this.apiUrl, { headers }).subscribe({
      next: (response) => {
        console.log('API response:', response);

        this.profile.fullName = response.fullName;
        this.profile.email = response.email;
        this.profile.role = response.role || 'User';

        console.log('Profile name:', this.profile.fullName);
        console.log('Profile email:', this.profile.email);

        this.isLoading = false;
             this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('API error:', error);
        this.errorMessage = 'Unable to load profile';
        this.isLoading = false;
             this.cdr.detectChanges();
      }
    });
  }
}