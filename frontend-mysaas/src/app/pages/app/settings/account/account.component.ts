import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatCardModule,
        MatOptionModule,
        MatButtonModule,
    ],
})
export class SettingsAccountComponent {
    profile = {
        name: 'Brian Hughes',
        username: 'brianh',
        title: 'Desenvolvedor Frontend Sênior',
        company: 'XYZ Software',
        about: "Olá! Sou Brian: marido, pai e gamer. Sou apaixonado por tecnologia de ponta e chocolate! 🍫",
        email: 'hughes.brian@mail.com',
        phone: '121-490-33-12',
        country: 'Estados Unidos',
        language: 'Espanhol'
    };

    saveProfile() {
        console.log('Perfil salvo:', this.profile);
    }

    cancelEdit() {
        console.log('Edição cancelada');
    }
}
