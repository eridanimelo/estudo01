import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { Component, inject, Input, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { ThemeService } from '../../service/theme.service';
import { AvatarService } from '../../../pages/app/settings/avatar.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-toolbar',
  imports: [
    CommonModule,
    MatSnackBarModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,

    MatBadgeModule,
    MatSidenavModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class Toolbar implements OnInit {


  @Input() drawer: any;
  @Input() username: string | undefined;
  private _snackBar = inject(MatSnackBar);

  hasAlerts = true;
  searchQuery: string = '';
  userProfileImage: string = 'https://via.placeholder.com/150';

  notifications: string[] = [];

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private router: Router,

    private avatarService: AvatarService,

    private keycloakService: KeycloakService, private themeService: ThemeService) { }

  ngOnInit(): void {
    // Inscreve-se no BehaviorSubject para atualizações do avatar
    this.avatarService.avatar$.subscribe((avatar) => {
      if (avatar) {
        this.userProfileImage = avatar;
      }
    });

    // Carrega o avatar inicial
    this.avatarService.loadLoggedUserAvatar();


  }


  async onLogout(): Promise<void> {
    try {
      await this.keycloakService.logout('http://localhost:4200');
    } catch (error) {
      console.error('Logout failed', error);
    }
  }

  onAlertClick() {
    this.hasAlerts = false;
  }

  onSearch() {
    // Lógica de busca
    console.log('Search query:', this.searchQuery);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get isDarkTheme(): boolean {
    return this.themeService.isDarkTheme();
  }

  navigateToHome() {
    // Navegação para a página inicial
  }

  navigateToSettings() {
    // Navegação para a página de configurações
  }

  isFullscreen = false;

  toggleFullscreen(): void {
    if (!this.isFullscreen) {
      this.openFullscreen();
    } else {
      this.closeFullscreen();
    }
    this.isFullscreen = !this.isFullscreen;
  }

  openFullscreen(): void {
    const elem = document.documentElement; // Fullscreen para o documento inteiro
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      /* Safari */
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      /* IE11 */
      (elem as any).msRequestFullscreen();
    }
  }

  closeFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      /* Safari */
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      /* IE11 */
      (document as any).msExitFullscreen();
    }
  }

}












