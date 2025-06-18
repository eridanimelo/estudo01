import { Component } from '@angular/core';
import { AvatarService } from '../avatar.service';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from '../../../../shared/service/message.service';


@Component({
  selector: 'app-avatar',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FormsModule, ImageCropperComponent],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  fileToUpload: File | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private avatarService: AvatarService,
    private errorHandler: MessageService) { }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    if (event.blob) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.blob));
      this.fileToUpload = event.blob as File; // Converta o Blob diretamente em um File, se necessário
    } else {
      console.error('ImageCroppedEvent does not contain a valid blob');
    }
  }

  imageLoaded(image: LoadedImage): void {
    console.log('Image loaded successfully:', image);
  }

  cropperReady(): void {
    console.log('Cropper is ready');
  }

  loadImageFailed(): void {
    console.error('Failed to load image');
  }

  uploadAvatar(): void {
    if (this.fileToUpload) {
      const userId = 1; // Substituir com o ID real do usuário
      this.avatarService.uploadAvatar(this.fileToUpload, userId).subscribe({
        next: () => {
          // Atualiza o BehaviorSubject com a nova imagem
          if (this.croppedImage) {
            this.avatarService.updateAvatar(this.croppedImage as string);
          }
          this.errorHandler.handleMessage('success', 'Avatar updated successfully!');
        },
        error: (error) => this.errorHandler.handleError(error),
      });
    } else {
      console.error('No image selected for upload');
    }
  }

  private dataURItoBlob(dataURI: string): Blob {
    if (!dataURI.includes(',')) {
      throw new Error('Invalid dataURI format');
    }
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

}
