import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserRepresentation, UserRequestDTO, UserService } from '../../../../../services/user.service';
import { MessageService } from '../../../../../shared/service/message.service';


function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
  };
}

@Component({
  selector: 'app-add-user-dialog',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss'],
})
export class AddUserDialogComponent {
  userForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private errorHandler: MessageService,
    private dialogRef: MatDialogRef<AddUserDialogComponent>
  ) {
    this.userForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordsMatchValidator() }
    );
  }


  createUser(): void {
    if (this.userForm.valid) {
      const formValues = this.userForm.value;

      const userRepresentation: UserRepresentation = {
        username: formValues.username,
        email: formValues.email,
      };

      const userRequest: UserRequestDTO = {
        user: userRepresentation,
        password: btoa(formValues.confirmPassword),
      };

      this.userService.createUser(userRequest).subscribe({
        next: () => {
          this.errorHandler.handleMessage('success', 'User created successfully!');
          this.dialogRef.close(userRequest);
        },
        error: (err) => {
          console.error(err);
          this.errorHandler.handleError(err);
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}