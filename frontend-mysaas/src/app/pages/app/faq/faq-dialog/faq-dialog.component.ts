import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FAQService } from '../../../../services/faq.service';
import { MessageService } from '../../../../shared/service/message.service';


@Component({
  selector: 'app-faq-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './faq-dialog.component.html',
  styleUrl: './faq-dialog.component.scss'
})
export class FaqDialogComponent {
  faqForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: FAQService,
    private errorHandler: MessageService,
    public dialogRef: MatDialogRef<FaqDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.faqForm = this.fb.group({
      id: [data.faq?.id || null],
      question: [data.faq?.question || '', [Validators.required, Validators.minLength(5)]],
      answer: [data.faq?.answer || '', [Validators.required, Validators.minLength(10)]],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.faqForm.invalid) {
      return;
    }

    const faq = this.faqForm.value;

    if (this.data.action === 'create') {
      this.service.createFAQ(faq).subscribe({
        next: (faqResult) => {
          this.errorHandler.handleMessage('success', 'FAQ criado com sucesso!');
          this.dialogRef.close(faqResult);
        },
        error: (err) => {
          console.error(err);
          this.errorHandler.handleError(err);
        },
      });
    } else {
      this.service.updateFAQ(faq).subscribe({
        next: (faqResult) => {
          this.errorHandler.handleMessage('success', 'FAQ atualizado com sucesso!');
          this.dialogRef.close(faqResult);
        },
        error: (err) => {
          console.error(err);
          this.errorHandler.handleError(err);
        },
      });
    }
  }
}