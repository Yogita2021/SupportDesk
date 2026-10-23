
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './layout/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  styleUrl: './app.css',
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('frontend');
  userName = 'User';
  userRole= 'user';
    ngOnInit(): void {
    let user = localStorage.getItem('user');
    let role = localStorage.getItem('role');
    if (user) {
      try {
        // const userData = JSON.parse(user);
        console.log("userData--->",user)
        this.userName = user;
        this.userRole = role || "";
      } catch (error) {
        console.error('Unable to read user information:', error);
      }
    }
  }
}
