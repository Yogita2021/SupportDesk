import { Routes } from '@angular/router';
import {Login} from './features/auth/login/login';
import {CreateTicket} from "./tickets/create-ticket/create-ticket";
import { MyTickets } from './tickets/my-tickets/my-tickets';
import { UserProfile } from './profile/user-profile/user-profile';
import { Dashboard } from './dashboard/dashboard';
import {TicketDetails} from './tickets/ticket-details/ticket-details'
export const routes: Routes = [
{path:"",
    redirectTo:"login",
    pathMatch:"full"
},
  { path: 'login', component: Login },
 {
    path: 'tickets/create',
    component: CreateTicket
  },
  {
    path: 'tickets',
    component: MyTickets
  }
,
{
  path: 'profile',
  component: UserProfile
},
  {
    path: 'dashboard',
    component: Dashboard
  },
{
  path: 'gettickets/:id',
  loadComponent: () =>
    import('./tickets/ticket-details/ticket-details')
      .then(m => m.TicketDetails)
}

];
