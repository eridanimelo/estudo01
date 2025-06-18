import { Component, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouterModule, RouterOutlet, NavigationEnd, ChildrenOutletContexts } from '@angular/router';
import { filter } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { MenuComponent } from './shared/components/menu/menu.component';

import { trigger, transition, style, animate, group, animateChild, query } from '@angular/animations';

import { ThemeService } from './shared/service/theme.service';
import { Toolbar } from './shared/components/toolbar/toolbar.component';
import { environment } from '../environments/environment';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter', [
        style({
          position: 'absolute',
          left: '100%',
          width: '100%'
        })
      ], { optional: true }),
      query(':leave', [
        style({
          position: 'absolute',
          left: '0%'
        })
      ], { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-in-out', style({
            left: '-100%',
            opacity: 0
          }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-in-out', style({
            left: '0%',
            opacity: 1
          }))
        ], { optional: true }),
        query('@*', animateChild(), { optional: true })
      ])
    ])
  ]);

@Component({
  selector: 'app-root',
  imports: [
    MenuComponent,
    Toolbar,
    RouterOutlet, CommonModule, RouterModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, MatSidenavModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent implements AfterViewChecked {
  public isPublicRoute = false;
  title = 'frontend-angular-19';
  username: string | undefined;
  isHandset: boolean = false;
  isSidenavOpened: boolean = true;
  isDarkTheme: boolean = false;

  constructor(private contexts: ChildrenOutletContexts,
    private themeService: ThemeService,

    private keycloakService: KeycloakService, private router: Router, private breakpointObserver: BreakpointObserver, private cdr: ChangeDetectorRef) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.isPublicRoute = !this.router.url.startsWith('/app');
    });

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isHandset = result.matches;
      this.isSidenavOpened = !result.matches;
    });
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  async ngOnInit() {
    if (this.keycloakService.getKeycloakInstance()?.authenticated) {

      const userDetails = await this.keycloakService.loadUserProfile();
      this.username = userDetails.username;
      const userId = userDetails.id;
      let email: string = userDetails.email!;


      this.setupTokenRefresh();

      this.themeService.darkTheme$.subscribe((isDark) => {
        this.isDarkTheme = isDark;
      });
    }
  }

  async onLogout(): Promise<void> {
    try {
      await this.keycloakService.logout(environment.keycloakRedirectUrl);
    } catch (error) {
      console.error('Logout failed', error);
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.cdr.detectChanges();  // Adiciona a detecção de mudanças após alterar o tema
  }

  private setupTokenRefresh(): void {
    setInterval(async () => {
      try {
        const isTokenExpired = this.keycloakService.isTokenExpired();
        if (isTokenExpired) {
          await this.keycloakService.updateToken(30);
          console.log('Token atualizado com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao atualizar o token', error);
        await this.keycloakService.login();
      }
    }, 30000);
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();  // Marca o componente para verificação de mudanças após a verificação da visão
  }
}
