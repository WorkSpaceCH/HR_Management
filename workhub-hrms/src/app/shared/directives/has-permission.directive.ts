import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionService } from '../../core/security/services/permission.service';
import { Subscription } from 'rxjs';
import { SecurityContextService } from '../../core/security/services/security-context.service';

/**
 * HasPermission Directive
 * 
 * Conditionally displays elements based on user permissions
 * Usage: *appHasPermission="'users:create'"
 * Or for multiple: *appHasPermission="['users:create', 'users:edit']"
 * Can require all permissions: *appHasPermission="['users:create', 'users:edit']; requireAll: true"
 */
@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  @Input('appHasPermission') permission: string | string[] = [];
  @Input('appHasPermissionRequireAll') requireAll = false;
  
  private permissions: string[] = [];
  private subscription = new Subscription();
  private hasView = false;
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService,
    private securityContext: SecurityContextService
  ) {}
  
  ngOnInit(): void {
    // Convert single permission to array
    this.permissions = Array.isArray(this.permission) 
      ? this.permission 
      : [this.permission];
    
    // Subscribe to permission changes
    this.subscription.add(
      this.securityContext.permissions$.subscribe(() => {
        this.updateView();
      })
    );
    
    // Initial check
    this.updateView();
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  private updateView(): void {
    // Check permissions
    const hasPermission = this.requireAll
      ? this.permissionService.hasAllPermissions(this.permissions)
      : this.permissionService.hasAnyPermission(this.permissions);
      
    // Update the view based on permission check
    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
