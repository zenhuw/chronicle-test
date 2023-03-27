import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnDestroy, OnInit {
  subscription: Subscription | undefined;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.subscription = this.authService.logout().subscribe(res => {
      this.router.navigateByUrl('/login').then();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
