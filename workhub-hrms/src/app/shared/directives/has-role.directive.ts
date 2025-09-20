import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Role } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private roles: Role[] = [];
  private isVisible = false;
  private userSubscription: Subscription;

  @Input()
  set appHasRole(roles: Role | Role[]) {
    this.roles = Array.isArray(roles) ? [...roles] : [roles];
    this.updateView();
  }

  @Input()
  set appHasRoleElse(templateRef: TemplateRef<any>) {
    this.elseTemplateRef = templateRef;
    this.updateView();
  }

  private elseTemplateRef: TemplateRef<any> | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {
    // Listen for changes to the user's authentication status
    this.userSubscription = this.authService.currentUser$.subscribe(() => {
      this.updateView();
    });
  }

  ngOnInit(): void {
    this.updateView();
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private updateView(): void {
    // If no roles provided, show the template (same as *ngIf="true")
    if (this.roles.length === 0) {
      this.showMainTemplate();
      return;
    }

    // Check if the user has any of the required roles
    if (this.authService.hasAnyRole(this.roles)) {
      this.showMainTemplate();
    } else {
      this.showElseTemplate();
    }
  }

  private showMainTemplate(): void {
    if (!this.isVisible) {
      this.isVisible = true;
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private showElseTemplate(): void {
    this.isVisible = false;
    this.viewContainer.clear();
    if (this.elseTemplateRef) {
      this.viewContainer.createEmbeddedView(this.elseTemplateRef);
    }
  }
}
