import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private toastr: ToastrService) { }

  handleMessage(type: string, message: string): void {
    console.log(`${type}: ${message}`);

    switch (type) {
      case 'success':
        this.toastr.success(message, 'Sucesso');
        break;
      case 'created':
        this.toastr.success(message, 'Criado');
        break;
      case 'edited':
        this.toastr.success(message, 'Editado');
        break;
      case 'unauthorized':
        this.toastr.error(message, 'Unauthorized');
        break;
      case 'error':
        this.toastr.error(message, 'Error');
        break;
      case 'warning':
        this.toastr.warning(message, 'Warning');
        break;
      case 'info':
        this.toastr.info(message, 'Informação');
        break;
      default:
        this.toastr.info(message, 'Informação');
    }
  }

  handleError(err: any): void {
    console.error(err);

    switch (err?.status) {
      case 500:
        this.handleMessage('error', `Internal Server Error: ${err?.error?.message}`);
        break;
      case 404:
        this.handleMessage('warning', `Not Found: ${err?.error?.message}`);
        break;
      case 400:
        this.handleMessage('warning', `Bad Request: ${err?.error?.message}`);
        break;
      case 401:
        this.handleMessage('warning', `Unauthorized: ${err?.error?.message}`);
        break;
      case 403:
        this.handleMessage('warning', `Forbidden: ${err?.error?.message}`);
        break;
      case 408:
        this.handleMessage('warning', `Request Timeout: ${err?.error?.message}`);
        break;
      default:
        this.handleMessage('info', `Error: ${err?.error?.message || 'Unexpected error occurred'}`);
        break;
    }
  }

}
