import { Directive, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TenantService } from '../../core/services/tenant.service';

/**
 * Directive to conditionally show/hide elements based on tenant context
 * Usage: *appTenantAware="departmentId"
 * Or with else template: *appTenantAware="departmentId; else noAccessTemplate"
 */
@Directive({
  selector: '[appTenantAware]'
})
export class TenantAwareDirective implements OnInit, OnDestroy {
  private departmentId: number | null = null;
  private isVisible = false;
  private tenantChangeSub: Subscription | null = null;

  @Input()
  set appTenantAware(departmentId: number | null) {
    this.departmentId = departmentId;
    this.updateView();
  }

  @Input()
  set appTenantAwareElse(templateRef: TemplateRef<any>) {
    this.elseTemplateRef = templateRef;
    this.updateView();
  }

  private elseTemplateRef: TemplateRef<any> | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    // Subscribe to changes in active tenant
    this.tenantChangeSub = this.tenantService.activeDepartment$.subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.tenantChangeSub) {
      this.tenantChangeSub.unsubscribe();
    }
  }

  private updateView(): void {
    // If no department ID is provided, always show the content
    if (this.departmentId === null || this.departmentId === undefined) {
      this.showMainTemplate();
      return;
    }

    // Check if the item belongs to the active tenant
    const belongs = this.tenantService.belongsToActiveTenant(this.departmentId);
    
    if (belongs) {
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
