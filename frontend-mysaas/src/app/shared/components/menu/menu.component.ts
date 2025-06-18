import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { ThemeService } from '../../service/theme.service';
import {
  trigger,
  style,
  animate,
  transition,
} from '@angular/animations';

interface MenuItem {
  name: string;
  route?: string;
  roles: string[];
  children?: MenuItem[]; // Submenus
  isExpanded?: boolean; // Para controlar a expansão do submenu
  isActive?: boolean;   // 
}


@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, MatSidenavModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  animations: [
    trigger('submenuAnimation', [ // Verifique o nome do trigger aqui
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0', opacity: 0 })),
      ]),
    ]),
  ],
})
export class MenuComponent {


  visibleMenuItems: MenuItem[] = [];

  menuItems: MenuItem[] = [
    { name: 'Home', route: '/app/scrumboard', roles: ['OWNER'] },

    { name: 'Chat', route: '/app/chat', roles: [] },

    {
      name: 'Administrativo',
      roles: ['admin', 'manager', 'OWNER'],
      children: [
        { name: 'Configurações', route: '/app/settings', roles: ['admin', 'manager'], isActive: false },
      ]
    },
  ];

  constructor(private keycloakService: KeycloakService, private router: Router, private themeService: ThemeService) { }

  async ngOnInit() {
    if (this.keycloakService.getKeycloakInstance()?.authenticated) {
      const userDetails = await this.keycloakService.loadUserProfile();
      await this.updateMenuItems();
      this.themeService.darkTheme$.subscribe((isDark) => {

      });
    }
  }

  async updateMenuItems() {
    const userRoles = await this.keycloakService.getUserRoles();
    this.visibleMenuItems = this.menuItems.filter((item) => {
      if (!item.roles.length) return true;
      return item.roles.some((role) => userRoles.includes(role));
    });
  }
  toggleSubmenu(item: MenuItem): void {
    // Se o item não estava expandido, marca como ativo e expande
    if (!item.isExpanded) {
      item.isExpanded = true;
      item.isActive = true;
    } else {
      // Se o item já estava expandido, apenas alterna a expansão, sem mexer no ativo
      item.isExpanded = false;
    }

    // Desmarcar o 'isActive' de todos os outros itens
    this.visibleMenuItems.forEach(menu => {
      if (menu !== item) {
        menu.isExpanded = false;
        menu.isActive = false;
      }
    });
  }

  // Método para desmarcar todos os itens ao clicar em um link do submenu
  removeActiveFromOtherItems(item: MenuItem): void {
    this.visibleMenuItems.forEach(menu => {
      if (menu !== item) {
        menu.isActive = false;
        menu.isExpanded = false;  // Fecha o submenu ao selecionar um item
      }
    });
  }


  async onLogout(): Promise<void> {
    try {
      await this.keycloakService.logout('http://localhost:4200');
    } catch (error) {
      console.error('Logout failed', error);
    }
  }
}