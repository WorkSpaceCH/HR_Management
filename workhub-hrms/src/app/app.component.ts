import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'workhub-hrms';
  isAuthRoute = false;
  private routerSubscription: Subscription;

  constructor(private router: Router) {
    // Subscribe to router events to detect when we're on an auth route
    this.routerSubscription = this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isAuthRoute = event.url.startsWith('/auth');
      });
    
    // Check current route on initialization
    const currentUrl = this.router.url;
    this.isAuthRoute = currentUrl.startsWith('/auth');
  }

  ngOnDestroy() {
    // Clean up subscription to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
