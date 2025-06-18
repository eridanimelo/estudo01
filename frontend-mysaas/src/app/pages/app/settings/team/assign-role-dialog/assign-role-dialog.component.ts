import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../../../services/user.service';


@Component({
  selector: 'app-assign-role-dialog',
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    MatDialogModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './assign-role-dialog.component.html',
  styleUrl: './assign-role-dialog.component.scss'
})
export class AssignRoleDialogComponent implements OnInit {
  availableRoles: string[] = [];
  selectedRole: string = '';

  constructor(
    private dialogRef: MatDialogRef<AssignRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string },
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.listAllRoles().subscribe({
      next: (roles) => {
        console.log(roles);
        this.availableRoles = roles.map((role) => role.name);
      },
      error: (err) => console.error(err),
    });
  }

  assignRole(): void {
    if (this.selectedRole) {
      this.userService.assignRole(this.data.userId, this.selectedRole).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => console.error(err),
      });
    }
  }
}
