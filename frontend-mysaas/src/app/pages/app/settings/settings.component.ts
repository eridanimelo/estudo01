import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { SettingsAccountComponent } from './account/account.component';
import { SettingsSecurityComponent } from './security/security.component';
import { SettingsTeamComponent } from './team/team.component';
import { ChangeDetectorRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AvatarComponent } from './avatar/avatar.component';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        SettingsAccountComponent,
        SettingsSecurityComponent,
        SettingsTeamComponent,
        AvatarComponent,
    ],
})
export class SettingsComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer!: MatDrawer;
    drawerMode: 'over' | 'side' = 'side'; // Controla o modo do drawer
    drawerOpened: boolean = true; // Controla se o drawer está aberto
    isHandset: boolean = false; // Variável para detectar dispositivos móveis
    panels: any[] = [];
    selectedPanel: string = 'avatar';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isSidenavOpened: boolean = true;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private breakpointObserver: BreakpointObserver
    ) { }

    ngOnInit(): void {
        // Dados dos painéis de configuração
        this.panels = [
            { id: 'avatar', title: 'Avatar', description: 'Altere sua imagem de perfil' },
            // { id: 'account', title: 'Conta', description: 'Gerencie seu perfil público e informações privadas' },
            { id: 'security', title: 'Segurança', description: 'Gerencie sua senha e preferências de verificação em 2 etapas' },
            // { id: 'plan-billing', title: 'Plano e Faturamento', description: 'Gerencie seu plano de assinatura, método de pagamento e informações de faturamento' },
            { id: 'team', title: 'Equipe', description: 'Gerencie sua equipe existente e altere papéis/permissões' },
            { id: 'exec-task', title: 'Executar Tasks', description: 'Executar Demandas recorrentes de forma manual caso haja alguma falha' },
        ];

        // Detectando mudanças no layout (se é um dispositivo móvel)
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            this.isHandset = result.matches; // Atualiza a variável isHandset
            this.isSidenavOpened = !result.matches;
            if (this.isHandset) {

                this.drawerMode = 'over'; // Modo 'over' em dispositivos móveis
                this.drawerOpened = false; // Fecha o drawer em dispositivos móveis por padrão
            } else {
                this.drawerMode = 'side'; // Modo 'side' em dispositivos maiores
                this.drawerOpened = true; // Mantém o drawer aberto em dispositivos maiores
            }
            this._changeDetectorRef.detectChanges(); // Força a detecção de mudanças para garantir que a UI seja atualizada
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // Método para navegar entre os painéis
    goToPanel(panel: string): void {
        this.selectedPanel = panel;
        if (this.isHandset) {
            this.drawer.close(); // Fecha o drawer ao ir para outro painel em dispositivos móveis
        }
    }

    // Método para obter as informações de um painel pelo id
    getPanelInfo(id: string): any {
        return this.panels.find((panel) => panel.id === id);
    }

    // Função de trackBy para otimização de performance
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
