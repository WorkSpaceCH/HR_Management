import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector, EmbeddedViewRef, ComponentRef } from '@angular/core';
import { NotificationToastComponent } from '../../shared/components/notification-toast/notification-toast.component';
import { Notification } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastRefs: ComponentRef<NotificationToastComponent>[] = [];
  private containerElement?: HTMLElement;

  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) { }

  showToast(notification: Notification, duration: number = 5000): void {
    // Ensure container exists
    this.getOrCreateContainer();
    
    // Create component
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(NotificationToastComponent)
      .create(this.injector);
    
    // Set component inputs
    componentRef.instance.notification = notification;
    componentRef.instance.duration = duration;
    
    // Listen for close events
    componentRef.instance.closed.subscribe(() => {
      this.removeToast(componentRef);
    });
    
    // Attach to appRef to ensure change detection
    this.appRef.attachView(componentRef.hostView);
    
    // Get DOM element and append to container
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.containerElement?.appendChild(domElem);
    
    // Store reference
    this.toastRefs.push(componentRef);
  }
  
  private getOrCreateContainer(): void {
    if (!this.containerElement) {
      // Create container if it doesn't exist
      this.containerElement = document.createElement('div');
      this.containerElement.className = 'toast-container';
      document.body.appendChild(this.containerElement);
    }
  }
  
  private removeToast(componentRef: ComponentRef<NotificationToastComponent>): void {
    // Get index of component
    const index = this.toastRefs.indexOf(componentRef);
    if (index > -1) {
      // Remove from array
      this.toastRefs.splice(index, 1);
      
      // Detach and destroy component
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }
  }
  
  clearAllToasts(): void {
    // Remove all toasts
    this.toastRefs.forEach(ref => {
      this.appRef.detachView(ref.hostView);
      ref.destroy();
    });
    this.toastRefs = [];
  }
}
