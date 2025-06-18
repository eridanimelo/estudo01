import { Routes } from '@angular/router';


import { AuthGuard } from './security/auth.guard';


import { SettingsComponent } from './pages/app/settings/settings.component';
import { LandingPageComponent } from './pages/public/landing-page/landing-page.component';
import { CreateUserComponent } from './pages/public/create-user/create-user.component';
import { HomeComponent } from './pages/app/home/home.component';
import { FaqComponent } from './pages/app/faq/faq.component';;


export const routes: Routes = [
    { path: 'register', component: CreateUserComponent, data: { animation: 'b' } },
    { path: '', component: LandingPageComponent, data: { animation: 'a' } },

    {
        path: 'app', component: HomeComponent, canActivate: [AuthGuard],
        data: { animation: 'a' }
    },



    {
        path: 'app/settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
        data: { animation: 'c' }
    },

    {
        path: 'app/faq',
        component: FaqComponent,
        canActivate: [AuthGuard],
        data: { roles: ['OWNER'], animation: 'd' }
    },





];
