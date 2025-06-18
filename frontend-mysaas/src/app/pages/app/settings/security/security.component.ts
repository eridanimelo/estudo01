import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserRepresentation, UserRequestDTO, UserService } from '../../../../services/user.service';
import { MessageService } from '../../../../shared/service/message.service';
import { KeycloakService } from 'keycloak-angular';
import { passwordMatchValidator } from '../team/team.component';


interface UserProfile {
    id: string;
    username: string;
    email: string;
    emailVerified: boolean;
    attributes: {
        [key: string]: string[];
    };
}

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatDividerModule,
    ],
    styleUrls: ['./security.component.scss'],
})
export class SettingsSecurityComponent implements OnInit {
    passwordForm: FormGroup;
    enable2FA: boolean = false;
    userId?: string;
    username?: string;
    email?: string;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private keycloakService: KeycloakService,
        private errorHandler: MessageService) {
        this.passwordForm = this.fb.nonNullable.group(
            {
                password: ['', Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/)],
                confirmPassword: ['', Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/)],
            },
            { validators: passwordMatchValidator }
        );


    }

    async ngOnInit() {
        if (this.keycloakService.getKeycloakInstance()?.authenticated) {
            try {
                const userDetails = await this.keycloakService.loadUserProfile() as UserProfile; // Adicionando o tipo explícito

                this.userId = userDetails.id;
                this.username = userDetails.username;
                this.email = userDetails.email;

                // Acessando o atributo otp_enabled
                this.enable2FA = userDetails.attributes['otp_enabled'][0] === 'true';

                // Exibindo o valor de otp_enabled
                console.log('OTP Enabled:', this.enable2FA);

            } catch (error) {
                console.error('Erro ao carregar perfil do usuário:', error);
            }
        }

    }


    changePassword() {


        const userRepresentation: UserRepresentation = {
            username: this.username!,
            email: this.email!,
        };

        const userRequest: UserRequestDTO = {
            user: userRepresentation,
            password: btoa(this.passwordForm.get('password')?.value),
            tenentId: ''
        };


        this.userService.resetPassword(userRequest).subscribe({
            next: () => {
                this.errorHandler.handleMessage('success', 'Password reset successfully.');
            },
            error: (err) => {
                console.error(err);
                this.errorHandler.handleError(err);
            },
        });


    }

    toggle2FA() {

        this.userService.toggleLoggedInUserTOTP().subscribe(
            {
                next: () => {
                    this.enable2FA ? this.errorHandler.handleMessage('success', 'Autenticação em 2 etapas ativada!') : this.errorHandler.handleMessage('warning', 'Autenticação em 2 etapas desativada!');


                },
                error: (err) => {
                    this.errorHandler.handleError(err);
                    this.enable2FA = !this.enable2FA;
                }
            }
        );

    }
}
