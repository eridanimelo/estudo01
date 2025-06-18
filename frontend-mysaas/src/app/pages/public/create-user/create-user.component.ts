import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserPublicService } from '../../../services/user-public.service';
import { MessageService } from '../../../shared/service/message.service';
import { UserRepresentation, UserRequestDTO } from '../../../services/user.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-create-user',
  imports: [MatCardModule, MatInputModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {

  createUserForm: FormGroup;

  constructor(private fb: FormBuilder, private service: UserPublicService, private errorHandler: MessageService) {
    this.createUserForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      tenentId: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.createUserForm.valid) {
      const formValues = this.createUserForm.value;


      // Criando o UserRepresentation
      const userRepresentation: UserRepresentation = {
        username: formValues.username,
        email: formValues.email,
      };

      // Criando o UserRequestDTO
      const userRequest: UserRequestDTO = {
        user: userRepresentation,
        password: btoa(formValues.confirmPassword),
        tenentId: formValues.tenentId
      };

      this.service.createUser(userRequest).subscribe(
        {
          next: () => {
            this.errorHandler.handleMessage('success', 'User created successfully!');
          },
          error: (err) => {
            console.error(err);
            this.errorHandler.handleError(err);
          },
        }
      );


    }
  }

}
