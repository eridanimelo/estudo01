// settings-team.component.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../../../shared/service/message.service';
import { UserRepresentation, UserService } from '../../../../services/user.service';
import { KeycloakService } from 'keycloak-angular';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AssignRoleDialogComponent } from './assign-role-dialog/assign-role-dialog.component';
import { ResetPasswordDialogComponent } from './reset-password-dialog/reset-password-dialog.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
};

@Component({
    selector: 'settings-team',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
        FormsModule, ReactiveFormsModule,
        MatTableModule,
        MatSlideToggleModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './team.component.html',
})
export class SettingsTeamComponent implements OnInit {

    users: any[] = [];
    filteredUsers: any[] = []; // Usuários filtrados
    filterValue = ''; // Valor do filtro digitado


    constructor(
        private dialog: MatDialog,
        private errorHandler: MessageService,
        private userService: UserService,
        private cdr: ChangeDetectorRef,
        private keycloakService: KeycloakService) {

    }
    async ngOnInit() {
        const authenticated = this.keycloakService.getKeycloakInstance()?.authenticated;
        if (authenticated) {
            try {
                await this.keycloakService.getToken(); // Espera o token ser obtido
                this.loadUsers(); // Carrega os usuários após a autenticação
            } catch (error) {
                console.error('Erro ao obter token:', error);
            }
        }
    }


    openAddUserDialog() {
        const dialogRef = this.dialog.open(AddUserDialogComponent, {
            width: '300px'
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadUsers();
            }
        });
    }

    loadUsers(): void {
        this.userService.listAllUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.filteredUsers = [...this.users];
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error(err);
                this.errorHandler.handleError(err);
            },
        });
    }

    filterUsers() {
        // Converte o filtro para minúsculo para realizar a comparação
        const filterTerm = this.filterValue.toLowerCase();

        // Filtra os usuários com base no nome, email ou roles
        this.filteredUsers = this.users.filter(user => {
            const username = user.username ? user.username.toLowerCase() : '';
            const email = user.email ? user.email.toLowerCase() : '';
            const roles = user.attributes?.roles ? user.attributes.roles.join(' ').toLowerCase() : '';

            return username.includes(filterTerm) || email.includes(filterTerm) || roles.includes(filterTerm);
        });
    }



    resetPassword(user: UserRepresentation): void {
        const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
            width: '300px',
            data: { user },
        });

        dialogRef.afterClosed().subscribe((newPassword) => {
            if (newPassword) {

            }
        });
    }

    deleteUser(user: UserRepresentation): void {

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '300px',
            data: { message: 'Are you sure you want to delete this user?' },
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.userService.deleteUser(user.id!).subscribe({
                    next: () => {

                        this.errorHandler.handleMessage('success', 'User deleted successfully!');
                        this.loadUsers();
                    },
                    error: (err) => {
                        console.error(err);
                        this.errorHandler.handleError(err);
                    },
                });
            }
        });
    }

    onToggleChangeDisable(user: UserRepresentation): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '300px',
            data: { message: `Are you sure you want to ${!user.enabled ? 'disable' : 'enable'} this user?` },
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                if (!user.enabled) {
                    this.userService.disableUser(user.id!).subscribe({
                        next: () => {
                            this.errorHandler.handleMessage('success', `User ${!user.enabled ? 'disable' : 'enable'}  successfully!`);
                            // this.loadUsers();
                        },
                        error: (err) => {
                            console.error(err);
                            this.errorHandler.handleError(err);
                        },
                    });
                } else {
                    this.userService.enableUser(user.id!).subscribe({
                        next: () => {
                            this.errorHandler.handleMessage('success', `User ${!user.enabled ? 'disable' : 'enable'}  successfully!`);
                            // this.loadUsers();
                        },
                        error: (err) => {
                            console.error(err);
                            this.errorHandler.handleError(err);
                        },
                    });
                }

            } else {
                user.enabled = !user.enabled;
            }
        });
    }

    openAssignRoleDialog(user: any): void {
        const dialogRef = this.dialog.open(AssignRoleDialogComponent, {
            width: '400px',
            data: { userId: user.id },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.errorHandler.handleMessage('success', 'Role assigned successfully!');
                this.loadUsers();
            }
        });
    }

    removeRole(user: any, roleName: string): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '300px',
            data: { message: `Are you sure you want to remove the role "${roleName}" from ${user.username}?` },
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.userService.removeRole(user.id, roleName).subscribe({
                    next: () => {
                        this.errorHandler.handleMessage('success', `Role "${roleName}" removed successfully!`);
                        this.loadUsers();
                    },
                    error: (err) => {
                        console.error(err);
                        this.errorHandler.handleError(err);
                    },
                });
            }
        });
    }
}
