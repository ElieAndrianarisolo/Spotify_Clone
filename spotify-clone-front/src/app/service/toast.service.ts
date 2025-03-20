// Import necessary modules and models
import { Injectable } from '@angular/core';
import { ToastInfo } from './model/toast-info.model';

// Injectable service for managing toast notifications
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  // Array to store active toast notifications
  toasts: ToastInfo[] = [];

  // Method to display a new toast notification
  show(body: string, type: 'SUCCESS' | 'DANGER') {
    // Determine the CSS class name based on the toast type
    let className;
    if (type === 'DANGER') {
      className = 'bg-danger text-light';
    } else {
      className = 'bg-success text-light';
    }
    // Create a new ToastInfo object with the given body and class name
    const toastInfo: ToastInfo = { body, className };
    // Add the new toast to the array of active toasts
    this.toasts.push(toastInfo);
  }

  // Empty constructor
  constructor() {}

  // Method to remove a toast notification from the array of active toasts
  remove(toast: ToastInfo) {
    // Filter out the toast to be removed from the array
    this.toasts = this.toasts.filter(
      (toastToCompare) => toastToCompare != toast
    );
  }
}
