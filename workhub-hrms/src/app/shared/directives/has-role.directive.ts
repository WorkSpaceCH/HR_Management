import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  private roles: string[] = [];
  private isVisible = false;

  @Input()
  set appHasRole(roles: string | string[]) {
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
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    if (this.authService.hasRole(this.roles)) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      this.isVisible = false;
      this.viewContainer.clear();
      if (this.elseTemplateRef) {
        this.viewContainer.createEmbeddedView(this.elseTemplateRef);
      }
    }
  }
}
